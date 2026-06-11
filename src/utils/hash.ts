/**
 * Password Hashing Utility
 * Uses Web Crypto API (SHA-256) for browser-compatible password hashing.
 */

const SALT_PREFIX = "leavemanager_";

/**
 * Hash a password using SHA-256 with a salt prefix.
 * Returns a 64-character hex string.
 */
export async function hashPassword(password: string): Promise<string> {
  const salted = SALT_PREFIX + password;
  const encoder = new TextEncoder();
  const data = encoder.encode(salted);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

/**
 * Verify a password against a stored hash.
 * Hashes the candidate password and compares with the stored hash.
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const candidateHash = await hashPassword(password);
  return candidateHash === hash;
}

/**
 * Check if a string is already a hashed value (64-character hex string).
 */
export function isHashed(password: string): boolean {
  return /^[a-f0-9]{64}$/.test(password);
}
