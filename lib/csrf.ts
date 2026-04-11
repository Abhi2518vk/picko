/**
 * CSRF protection utilities
 */

import { generateCSRFToken, validateCSRFToken } from "./encryption";

const CSRF_TOKEN_KEY = "csrf_token";
const CSRF_HEADER = "X-CSRF-Token";

// Generate and store CSRF token
export function generateAndStoreCSRFToken(): string {
  const token = generateCSRFToken();
  
  // Store in sessionStorage (short-lived)
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(CSRF_TOKEN_KEY, token);
  }
  
  return token;
}

// Get stored CSRF token
export function getStoredCSRFToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(CSRF_TOKEN_KEY);
}

// Validate CSRF token from request
export function validateRequestCSRFToken(requestToken: string | null): boolean {
  const storedToken = getStoredCSRFToken();
  
  if (!storedToken || !requestToken) {
    return false;
  }
  
  return validateCSRFToken(requestToken, storedToken);
}

// Add CSRF token to fetch requests
export function withCSRFToken(options: RequestInit = {}): RequestInit {
  const token = getStoredCSRFToken();
  
  if (!token) {
    console.warn("CSRF token not found. Generating new one.");
    generateAndStoreCSRFToken();
    return options;
  }
  
  return {
    ...options,
    headers: {
      ...options.headers,
      [CSRF_HEADER]: token,
    },
  };
}

// CSRF protected fetch wrapper
export async function csrfFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const csrfOptions = withCSRFToken(options);
  
  const response = await fetch(url, csrfOptions);
  
  // Check for CSRF validation errors
  if (response.status === 403) {
    const error = await response.json();
    if (error.code === "CSRF_TOKEN_INVALID") {
      console.error("CSRF token invalid. Regenerating...");
      generateAndStoreCSRFToken();
      throw new Error("CSRF token invalid. Please try again.");
    }
  }
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
}

// Initialize CSRF protection
export function initializeCSRFProtection(): void {
  if (typeof window === 'undefined') return;
  
  // Generate token if not exists
  if (!getStoredCSRFToken()) {
    generateAndStoreCSRFToken();
  }
  
  // Add CSRF token to all forms
  document.addEventListener("DOMContentLoaded", () => {
    const forms = document.querySelectorAll("form");
    forms.forEach(form => {
      const tokenInput = document.createElement("input");
      tokenInput.type = "hidden";
      tokenInput.name = "_csrf";
      tokenInput.value = getStoredCSRFToken() || "";
      form.appendChild(tokenInput);
    });
  });
}

// Middleware for Next.js API routes
export function csrfMiddleware(handler: Function) {
  return async (req: any, res: any) => {
    // Skip CSRF check for GET, HEAD, OPTIONS requests
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
      return handler(req, res);
    }
    
    // Get token from header or body
    const token = req.headers[CSRF_HEADER.toLowerCase()] || req.body?._csrf;
    
    if (!validateRequestCSRFToken(token)) {
      return res.status(403).json({
        error: "CSRF token invalid or missing",
        code: "CSRF_TOKEN_INVALID",
      });
    }
    
    return handler(req, res);
  };
}

// React hook for CSRF protection (requires React import in component)
export function useCSRF() {
  // This is a template hook - import useState and useEffect in your component
  throw new Error("useCSRF hook requires React imports. Use in component with: import { useState, useEffect } from 'react';");
}

// Helper for forms
export function getCSRFFormData(data: FormData | Record<string, any>): FormData {
  const formData = data instanceof FormData ? data : new FormData();
  const token = getStoredCSRFToken();
  
  if (token && !(data instanceof FormData)) {
    (data as Record<string, any>)._csrf = token;
  } else if (token) {
    formData.append("_csrf", token);
  }
  
  return formData;
}