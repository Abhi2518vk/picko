/**
 * Encryption utilities for sensitive data storage
 * Uses Web Crypto API for client-side encryption
 */

const ENCRYPTION_KEY = "pickngo_secure_storage_v1";

// Generate a deterministic key from a passphrase
async function getKey(passphrase: string = ENCRYPTION_KEY): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode("pickngo_salt"),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

// Encrypt data
export async function encryptData(data: any): Promise<string> {
  try {
    const key = await getKey();
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encryptedContent = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      encoder.encode(JSON.stringify(data))
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encryptedContent.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedContent), iv.length);

    // Convert to base64 for storage
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Failed to encrypt data");
  }
}

// Decrypt data
export async function decryptData<T>(encryptedBase64: string): Promise<T | null> {
  try {
    const key = await getKey();
    
    // Convert from base64
    const binaryString = atob(encryptedBase64);
    const combined = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      combined[i] = binaryString.charCodeAt(i);
    }

    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const encryptedData = combined.slice(12);

    const decryptedContent = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      encryptedData
    );

    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decryptedContent));
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}

// Secure storage wrapper
export class SecureStorage {
  static async setItem(key: string, value: any): Promise<void> {
    try {
      const encrypted = await encryptData(value);
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error(`Failed to encrypt ${key}:`, error);
      // Fallback to plain storage if encryption fails
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  static async getItem<T>(key: string): Promise<T | null> {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;

      // Try to decrypt
      const decrypted = await decryptData<T>(encrypted);
      if (decrypted !== null) {
        return decrypted;
      }

      // If decryption fails, try to parse as plain JSON (backward compatibility)
      try {
        return JSON.parse(encrypted);
      } catch {
        return null;
      }
    } catch (error) {
      console.error(`Failed to decrypt ${key}:`, error);
      return null;
    }
  }

  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  static clear(): void {
    localStorage.clear();
  }
}

// Hash function for rate limiting
export async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate CSRF token
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Validate CSRF token
export function validateCSRFToken(token: string, expectedToken: string): boolean {
  return token === expectedToken;
}