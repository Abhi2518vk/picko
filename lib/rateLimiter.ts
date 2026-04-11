/**
 * Rate limiting utilities for API endpoints
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  message?: string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = {
      maxRequests: config.maxRequests,
      windowMs: config.windowMs,
      message: config.message || "Too many requests, please try again later.",
    };
  }

  // Check if request is allowed
  check(key: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry) {
      // First request
      this.store.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs,
      });
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: now + this.config.windowMs,
      };
    }

    // Check if window has expired
    if (now > entry.resetTime) {
      // Reset counter
      this.store.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs,
      });
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: now + this.config.windowMs,
      };
    }

    // Check if limit exceeded
    if (entry.count >= this.config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    // Increment counter
    entry.count++;
    this.store.set(key, entry);

    return {
      allowed: true,
      remaining: this.config.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  // Clean up expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }

  // Get current status
  getStatus(key: string) {
    const entry = this.store.get(key);
    if (!entry) {
      return {
        count: 0,
        remaining: this.config.maxRequests,
        resetTime: Date.now() + this.config.windowMs,
      };
    }
    return {
      count: entry.count,
      remaining: Math.max(0, this.config.maxRequests - entry.count),
      resetTime: entry.resetTime,
    };
  }
}

// Default rate limiters
export const loginRateLimiter = new RateLimiter({
  maxRequests: 5, // 5 attempts
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: "Too many login attempts. Please try again in 15 minutes.",
});

export const apiRateLimiter = new RateLimiter({
  maxRequests: 100, // 100 requests
  windowMs: 60 * 1000, // 1 minute
  message: "API rate limit exceeded. Please try again in a minute.",
});

export const cartRateLimiter = new RateLimiter({
  maxRequests: 50, // 50 cart operations
  windowMs: 5 * 60 * 1000, // 5 minutes
  message: "Too many cart operations. Please slow down.",
});

// IP-based rate limiting (for server-side)
export class IPRateLimiter {
  private limiters: Map<string, RateLimiter> = new Map();

  constructor(private config: RateLimitConfig) {}

  check(ip: string) {
    if (!this.limiters.has(ip)) {
      this.limiters.set(ip, new RateLimiter(this.config));
    }
    return this.limiters.get(ip)!.check(ip);
  }

  cleanup() {
    for (const limiter of this.limiters.values()) {
      limiter.cleanup();
    }
  }
}

// Client-side rate limiting helper
export function clientRateLimit(key: string, limiter: RateLimiter): boolean {
  if (typeof window === 'undefined') return true; // Skip on server
  
  const result = limiter.check(key);
  
  if (!result.allowed) {
    console.warn(`Rate limit exceeded for ${key}: ${limiter['config'].message}`);
    return false;
  }
  
  return true;
}

// Login-specific rate limiting
export function checkLoginRateLimit(identifier: string): boolean {
  return clientRateLimit(`login_${identifier}`, loginRateLimiter);
}

// API call rate limiting
export function checkAPIRateLimit(endpoint: string): boolean {
  return clientRateLimit(`api_${endpoint}`, apiRateLimiter);
}

// Cart operations rate limiting
export function checkCartRateLimit(userId: string): boolean {
  return clientRateLimit(`cart_${userId}`, cartRateLimiter);
}