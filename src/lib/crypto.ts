// WebCrypto helpers for at-rest encryption: AES-256-GCM + PBKDF2-SHA256.
// Everything here is pure; no state, no imports from the rest of the app.

export const KDF_ITERATIONS = 600_000; // OWASP-recommended work factor for PBKDF2-HMAC-SHA256
export const KEY_LENGTH = 256;
const SALT_BYTES = 16;
const IV_BYTES = 12; // 96-bit GCM nonce

function getCrypto(): Crypto {
  if (typeof window === "undefined" || !window.crypto) {
    throw new Error("WebCrypto is not available in this browser.");
  }
  return window.crypto;
}

export function randomBytes(bytes: number): Uint8Array<ArrayBuffer> {
  const out = new Uint8Array(bytes);
  getCrypto().getRandomValues(out);
  return out;
}

export function newSalt(): Uint8Array<ArrayBuffer> {
  return randomBytes(SALT_BYTES);
}

export function newIv(): Uint8Array<ArrayBuffer> {
  return randomBytes(IV_BYTES);
}

export function toBase64(bytes: Uint8Array<ArrayBuffer>): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

export function fromBase64(s: string): Uint8Array<ArrayBuffer> {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

// Derive an AES-GCM key from a passcode. The same salt + iterations must be
// used every time to recover the same key. The key is non-extractable and
// never persisted — only the salt/iterations are.
export async function deriveKey(
  passcode: string,
  salt: Uint8Array<ArrayBuffer>,
  iterations: number = KDF_ITERATIONS,
): Promise<CryptoKey> {
  const crypto = getCrypto();
  if (!crypto.subtle) throw new Error("WebCrypto subtle is not available in this browser.");

  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(passcode), "PBKDF2", false, [
    "deriveKey",
  ]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: KEY_LENGTH },
    false, // non-extractable: the key can never be exported, only used
    ["encrypt", "decrypt"],
  );
}

export interface EncryptedPayload {
  iv: string; // base64
  data: string; // base64 ciphertext (GCM authenticates it)
}

export async function encryptJson(key: CryptoKey, value: unknown): Promise<EncryptedPayload> {
  const crypto = getCrypto();
  const iv = newIv();
  const plaintext = new TextEncoder().encode(JSON.stringify(value));
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext);
  return { iv: toBase64(iv), data: toBase64(new Uint8Array(ciphertext)) };
}

// Throws (DOMException / OperationError) if the key is wrong or the payload was
// tampered with — GCM is authenticated, so a wrong key means wrong tag.
export async function decryptJson<T>(key: CryptoKey, payload: EncryptedPayload): Promise<T> {
  const crypto = getCrypto();
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromBase64(payload.iv) },
    key,
    fromBase64(payload.data),
  );
  return JSON.parse(new TextDecoder().decode(plaintext)) as T;
}
