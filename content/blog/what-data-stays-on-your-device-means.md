---
title: "What 'your data stays on your device' actually means"
description: "If someone picks up your phone, can they read your expenses? What 'encrypted at rest' really protects — and what it doesn't."
date: 2026-08-08
tags:
  - Privacy
author: "Sarthak Dobriyal"
related:
  - why-hisaabi-keeps-your-data-local
  - how-hisaabi-encrypts-your-data
---

![A locked expense tracker is a sealed safe](/images/blog/safe-on-phone.svg)

Apps love telling you your data is "secure" or "private." Those words mean very different things depending on who's saying them. Let's do a thought experiment that cuts through the marketing.

Your phone is in your pocket. Your expense tracker is on it. Now imagine you leave the phone on a table at a café and walk away for ten minutes.

When you come back — did anything change? No. But while you were gone, if someone picked it up, could they have read every expense you've logged this year?

The answer depends on one thing: **was the app locked?**

## The plain-English version

Think of your expense tracker as a safe in your house.

- **Locked** means the safe is closed. The receipts and account statements inside are sealed away. Someone could walk in and pick up the safe, and they'd see a metal box with a lock they can't open. That's what **"encrypted at rest"** means: the data on your device is scrambled into unreadable form whenever the app isn't open and unlocked.
- **Unlocked** means the safe is open and you're going through the receipts. The data is visible — because *you* are using it. Anyone standing next to you could also see it.

That's it. That's the whole concept, and it's the concept almost every "privacy" app is built on. It's not magic. It's just a lock that only your passcode opens.

## What the lock actually is

When you set a passcode in an app like Hisaabi, two technical things happen under the hood, and you deserve to know both even if the details sound scary:

1. **Your data is scrambled with a cipher called AES-256** — the same kind of encryption used in banking and in HTTPS, the padlock you see on every secure website. It turns "spent 450 on groceries" into a string of characters that looks like random noise.
2. **The "key" to unscramble it is made from your passcode** — by a process called PBKDF2 that runs your passcode through math **600,000 times**. Why so many times? So that anyone trying to *guess* your passcode has to do 600,000 rounds of work for every single guess. It makes guessing slow and expensive.

The key part: **the key is never stored on your device.** It's created fresh from your passcode every time you unlock, and thrown away when you lock. So there's nothing for anyone to steal — no hidden file that unscrambles everything. If you don't know the passcode, the data stays scrambled. Permanently.

That last point has a real consequence, and it's important: **if you forget your passcode, your data cannot be recovered.** By anyone, including the people who built the app. That's why apps like this push you to keep a backup — the backup uses the same passcode, so treat both like the only keys to your safe.

## So what does "your data stays on your device" protect?

Put the safe back on the table. Here's what the lock does for you:

- Someone picks up your phone while the app is locked → they see a passcode screen and unreadable data.
- You lose the phone → whoever finds it has a sealed box.
- A thief copies the files off your device, or reads your browser's storage from a laptop backup → still a sealed box.

And here's what the lock does *not* do — no app can promise this, and you should be suspicious of any that claims to:

- Someone watches you type your passcode → they can open it.
- You leave the app unlocked and walk away → the safe is open.
- A virus or keylogger is already on your phone recording everything you type → it records the passcode too.
- Your passcode is "1234" → the lock is basically a cardboard box.

A privacy app's job is to make sure that in the normal case — phone in your pocket, app not in use — your financial life is a sealed box. It can't protect you from someone standing *inside* your house with you. Honest apps say that out loud; marketing apps don't.

## How to check any app, not just ours

You can apply this test to any tracker you use, in about two minutes:

1. **Is there a passcode or PIN lock at all?** If not, your data sits readable on your device whenever it isn't your screen. Uninstall-and-reinstall doesn't change that.
2. **Does it need an account, a phone number, or an email to work?** Then your data is somewhere on their server, full stop — and "stored on your device" was never literally true. A finance app that needs an account is a cloud app wearing a costume.
3. **Is it open source?** You don't have to read code. But the fact that you *could* — that anyone can verify where data goes and whether it's encrypted — is the only "trust us" claim you can actually check. Closed-source privacy is a promise; open-source privacy is a receipt.
4. **Read the privacy policy with two searches:** the word *share* and the word *third party*. If a tracker monetizes your data, the policy has to cover itself with language like that. A local-first app won't have those sections at all, because there's nothing to share.

## The honest version of the pitch

I built [Hisaabi](/app) to be the app I kept failing to find: it logs expenses by chatting ("spent 200 on chai"), keeps every record in your own browser, and — if you want — seals it behind a passcode whenever it's locked. No account, no cloud, no server to leak. The network tab in your browser proves it: the only thing that ever leaves is the message you send to the AI provider *you* chose, with *your* key.

But the real promise is narrower and more honest than the marketing you usually hear: **your money data is a safe in your pocket, and you hold the key.** That's a good deal — and unlike most, it's one you can verify yourself.

If the how-it-works details interest you, the [technical breakdown](/blog/how-hisaabi-encrypts-your-data) walks through the encryption in full. Or read [why Hisaabi keeps your data local](/blog/why-hisaabi-keeps-your-data-local) for the story behind the decision.
