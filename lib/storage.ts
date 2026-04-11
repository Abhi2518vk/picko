/**
 * Safe localStorage access utilities for Next.js SSR compatibility
 */

export const isClient = typeof window !== 'undefined';

export class SafeStorage {
  static getItem(key: string): string | null {
    if (!isClient) return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Failed to get ${key} from localStorage`, error);
      return null;
    }
  }

  static setItem(key: string, value: string): void {
    if (!isClient) return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Failed to set ${key} in localStorage`, error);
    }
  }

  static removeItem(key: string): void {
    if (!isClient) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove ${key} from localStorage`, error);
    }
  }

  static getJSON<T>(key: string): T | null {
    const item = this.getItem(key);
    if (!item) return null;
    try {
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Failed to parse ${key} from localStorage`, error);
      return null;
    }
  }

  static setJSON(key: string, value: any): void {
    try {
      this.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to stringify ${key} for localStorage`, error);
    }
  }
}