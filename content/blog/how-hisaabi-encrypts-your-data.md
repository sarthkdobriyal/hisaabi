---
title: "AES-256-GCM and PBKDF2: how Hisaabi encrypts your data"
description: "A deep dive into the crypto behind Hisaabi's passcode lock — AES-256-GCM, PBKDF2 with 600,000 iterations, and why a wrong passcode fails cleanly."
date: 2026-08-08
tags:
  - Privacy
  - Encryption
  - Engineering
author: "Sarthak Dobriyal"
cover: "https://images.unsplash.com/photo-1764231467848-dc20e066cde2?q=80&w=706&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
related:
  - why-hisaabi-keeps-your-data-local
  - what-data-stays-on-your-device-means
  - your-expense-tracker-is-reading-your-bank-sms
---

![What happens when you lock Hisaabi](/images/blog/vault-flow.svg)

Hisaabi stores your financial data in IndexedDB — a database your browser keeps on disk. When you turn on the passcode lock, that data gets encrypted at rest with **AES-256-GCM**, and the key is derived from your passcode with **PBKDF2-HMAC-SHA256** at **600,000 iterations**. This post is the unedited version of how that works: the design, the primitives, the failure modes, and the honest threat model. If you read to the end, you'll understand exactly what we protect and exactly what we don't.

## First, the constraint that shapes everything

Here's the trap you hit the moment you say "encrypt my local database": **IndexedDB can't query encrypted rows.** Our dashboard filters expenses by month, the chat answers "how much on food this month?", charts aggregate across dates — all of that relies on queryable plaintext values in the database. If we encrypted each row, we'd have to decrypt the *entire* database in memory on every read, or lose range queries entirely.

So the design is a **vault + working tables** split, the same pattern password managers use:

- **Working tables (plaintext)** — the five sensitive stores (`expenses`, `income`, `profile`, `memories`, `chatMessages`) live here *while the app is unlocked*. Every existing query works unchanged, because this is the same shape as before.
- **The vault** — a single record holding an **encrypted snapshot** of all five tables as one JSON blob. This is the only form in which data rests on disk when the app is locked.

The lifecycle:

```
ENABLE:  passcode → PBKDF2 → key (in memory)
         snapshot tables → AES-256-GCM → write vault blob → wipe plaintext tables → locked

UNLOCK:  read salt + iterations → PBKDF2(passcode) → same key
         AES-GCM verify + decrypt → repopulate tables → unlocked (key in memory only)

LOCK:    snapshot tables → re-encrypt vault → wipe plaintext → key discarded
```

## PBKDF2: turning a passcode into a key

AES keys must be 256 bits of high-entropy randomness. A passcode like `doston-se-khaana` has maybe 30 bits of entropy and obeys human patterns. You can't hand it to AES directly.

**PBKDF2 (Password-Based Key Derivation Function 2)** stretches the weak passcode into a strong key by applying HMAC-SHA-256 in a loop:

```
key = HMAC-SHA256(passcode ‖ salt, 1)
    → HMAC-SHA256(passcode ‖ salt, prev)   // 600,000 times
```

Two details matter:

- **Salt.** A random 16-byte value generated once and stored *next to* the ciphertext. It isn't secret, but it makes every vault unique: same passcode + different salt = different key. That kills rainbow-table attacks and means one person's passcode can't be reused against another's vault.
- **Iterations (600,000).** This is deliberate slowness. Each unlock costs you maybe 100ms — fine, you do it once. For an attacker guessing passcodes, every guess costs 100ms of PBKDF2 work. At that rate, even a mediocre passcode becomes prohibitively expensive to brute-force. This is the current [OWASP recommendation](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) for PBKDF2-HMAC-SHA256, and the iteration count is stored per-vault so older vaults keep working after we raised the constant.

Why PBKDF2 and not Argon2/scrypt? Those are **memory-hard** — better against GPU/ASIC cracking. But we run in the browser, and WebCrypto (the one cryptography API browsers ship) only provides PBKDF2. It's the pragmatic choice, and 600k iterations is the correct work factor *for PBKDF2 specifically*.

The derived key is created with `extractable: false` — Web Crypto marks it non-extractable, so even if malicious code ran in the page, the key can be *used* for encrypt/decrypt but never read or exported. The key never touches disk. Only the salt and iteration count are persisted.

## AES-256-GCM: the encryption, with a built-in lie detector

AES (Advanced Encryption Standard) is a symmetric block cipher — same key encrypts and decrypts — and 256 refers to the key size. It's hardware-accelerated (AES-NI) and the standard for financial-grade cryptography.

**GCM (Galois/Counter Mode)** is the mode we use, and it's chosen deliberately. GCM is *authenticated encryption*: it produces not just ciphertext but a **128-bit authentication tag** over the whole payload.

That tag is the important part. Two consequences:

1. **Wrong passcode → clean failure, not garbage.** The wrong passcode produces the wrong key, the tag fails to verify, and decryption throws. The user sees "Wrong passcode," never corrupted screens of gibberish.
2. **Tamper detection.** Change one bit of the stored blob and the tag breaks. There's no silent data corruption — it's rejected.

GCM also needs a **random 96-bit nonce (IV)** for every encryption, stored alongside the ciphertext. We generate a fresh one on every encrypt, which means even encrypting identical data twice produces different ciphertext — no pattern leakage, and no IV reuse (the classic GCM catastrophe) as long as each encrypt gets fresh randomness from `crypto.getRandomValues`.

## Keeping the vault fresh: the sync story

The vault snapshot has to track the live tables, or you lose data on crash. We subscribe to Dexie's `storagemutated` event, which fires after any committed transaction. When a sensitive table changes while unlocked, we debounce and **re-encrypt the whole snapshot into the vault** (300ms). The vault write itself touches only the `vault` table, so it can't trigger a feedback loop.

This gives a good crash story: a tab killed mid-session leaves, at worst, the last ~300ms of writes missing — but because the vault was continuously refreshed, the bulk of the session is safe. And on next boot with encryption enabled, we **wipe any leftover plaintext** from the previous session as crash cleanup; the vault is the source of truth, and the app shows the unlock screen.

## The threat model, stated honestly

No amount of cryptography fixes a weak passcode, a keylogger, or a browser that's already compromised. Encryption here protects **data at rest**:

**Protects against:** a device that's lost or confiscated; someone (or some malware) reading the raw IndexedDB files from disk or an OS backup while the app is locked; a browser profile copied off the machine. In all those cases, what they find is an opaque blob of AES-256-GCM ciphertext with no key anywhere near it.

**Does not protect against:** someone using your *already-unlocked* browser session (the working tables are plaintext by design — the app is using them); a keylogger or malicious extension recording your passcode as you type it; shoulder-surfing; or a passcode like `1234`. We say so in the UI and on the [privacy page](/privacy), because a security claim you can't verify is just marketing.

## Trade-offs we accepted

- **Single-tab is the v1 assumption.** The vault snapshot syncs on writes, but simultaneous multi-tab editing can race. Local-first apps are typically single-tab; we document rather than fake multi-tab support.
- **Plaintext-while-unlocked.** This is the unavoidable price of queryable local data. Auto-lock (default 15 min) shrinks the window where a device is unlocked but unattended.
- **Lost passcode = lost data. By design.** There's no backdoor, no recovery flow, no "forgot passcode" reset that doesn't require the key. GCM is authenticated; without the right key there is no data. That's why we push backups — and encrypted backups use the same passcode, so a backup is exactly as recoverable as your memory of the passcode.

## The whole thing is open source

None of this is a claim to take on faith. The crypto lives in `src/lib/crypto.ts` and the vault logic in `src/lib/vault.ts` of the [Hisaabi repo](https://github.com/sarthkdobriyal/hisaabi). If you're building a local-first app and want a reference for the vault + working-tables pattern, or if you find a hole in our reasoning — read it, and tell us.

For the non-technical version of this story, the [explainer post](/blog/what-data-stays-on-your-device-means) is a better place to start. For the *why* behind all of it, read [why Hisaabi keeps your money data local](/blog/why-hisaabi-keeps-your-data-local).
