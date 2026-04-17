"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/lib/mockData";
import { SafeStorage } from "@/lib/storage";
import { cartItemSchema, safeValidate } from "@/lib/validation";

export type CartItem = Product & { quantity: number };

type CartContextType = {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
  totalItems: number;
  loading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedCart = SafeStorage.getJSON<CartItem[]>("cart");
    if (savedCart) {
      const validItems = savedCart.filter(item => {
        const validation = safeValidate(cartItemSchema, item);
        return validation.success;
      });
      setItems(validItems);
    }
    setLoading(false);
  }, []);

  const saveCart = (newItems: CartItem[]) => {
    SafeStorage.setJSON("cart", newItems);
  };

  // ✅ FIXED: addToCart only ever adds a fresh item with quantity 1
  // It will never increment — updateQuantity handles that
  const addToCart = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);

      if (existing) {
        return prev; // already in cart, do nothing
      }

      const cartItem: CartItem = { ...product, quantity: 1 };
      const validation = safeValidate(cartItemSchema, cartItem);
      if (!validation.success) {
        console.error("Invalid cart item:", validation.errors);
        return prev;
      }

      const newItems = [...prev, cartItem];
      saveCart(newItems); // ✅ saveCart inside the block
      return newItems;
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => {
      const newItems = prev.filter((i) => i.id !== productId);
      saveCart(newItems);
      return newItems;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prev) => {
      let newItems: CartItem[];

      if (quantity <= 0) {
        newItems = prev.filter((i) => i.id !== productId);
      } else {
        newItems = prev.map((i) =>
          i.id === productId ? { ...i, quantity } : i
        );

        const updatedItem = newItems.find(i => i.id === productId);
        if (updatedItem) {
          const validation = safeValidate(cartItemSchema, updatedItem);
          if (!validation.success) {
            console.error("Invalid quantity:", validation.errors);
            return prev;
          }
        }
      }

      saveCart(newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    SafeStorage.removeItem("cart");
  };

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalAmount,
      totalItems,
      loading,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};