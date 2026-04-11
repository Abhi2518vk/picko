import { z } from "zod";

// User validation schema
export const userSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
  gender: z.enum(["male", "female", "other"]).optional(),
});

export type UserInput = z.infer<typeof userSchema>;

// Login validation schemas
export const phoneLoginSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
});

export const emailLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Product validation schema
export const productSchema = z.object({
  id: z.string().min(1, "Product ID is required"),
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be non-negative"),
  image: z.string().url("Invalid image URL").optional(),
  category: z.string().optional(),
});

// Cart item validation schema
export const cartItemSchema = productSchema.extend({
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

// Location validation schema
export const locationSchema = z.object({
  lat: z.number().min(-90).max(90, "Latitude must be between -90 and 90"),
  lng: z.number().min(-180).max(180, "Longitude must be between -180 and 180"),
  address: z.string().min(1, "Address is required"),
});

// Validation utilities
export function validatePhoneNumber(phone: string): boolean {
  return /^\d{10}$/.test(phone);
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= 6;
}

// Safe validation with error messages
export function safeValidate<T>(schema: z.Schema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: string[];
} {
  try {
    const result = schema.safeParse(data);
    if (result.success) {
      return { success: true, data: result.data };
    } else {
      const errors = result.error.issues.map((issue: any) => `${issue.path.join('.')}: ${issue.message}`);
      return { success: false, errors };
    }
  } catch (error) {
    return { success: false, errors: ["Validation failed"] };
  }
}
