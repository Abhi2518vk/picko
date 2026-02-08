"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/lib/mockData";

// --- Location Context ---
type Location = {
    lat: number;
    lng: number;
    address: string;
};

const DEFAULT_LOCATION: Location = { lat: 12.9716, lng: 77.5946, address: "MG Road, Bangalore" };

type LocationContextType = {
    location: Location;
    setLocation: (loc: Location) => void;
    detectLocation: () => void;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

// --- Cart Context ---
export type CartItem = Product & { quantity: number };

type CartContextType = {
    items: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    totalAmount: number;
    totalItems: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// --- Providers ---
export function Providers({ children }: { children: ReactNode }) {
    // Location State
    const [location, setLocationState] = useState<Location>(DEFAULT_LOCATION);

    const detectLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLocationState({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    address: "Detected Location", // In real app, use Reverse Geocoding API
                });
            }, (error) => {
                console.error("Error detecting location", error);
                alert("Unable to detect location. Using default.");
            });
        }
    };

    // Cart State
    const [items, setItems] = useState<CartItem[]>([]);

    const addToCart = (product: Product) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.id === product.id);
            if (existing) {
                return prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: string) => {
        setItems((prev) => prev.filter((i) => i.id !== productId));
    };

    const clearCart = () => setItems([]);

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <LocationContext.Provider value={{ location, setLocation: setLocationState, detectLocation }}>
            <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, totalAmount, totalItems }}>
                {children}
            </CartContext.Provider>
        </LocationContext.Provider>
    );
}

// --- Hooks ---
export const useLocation = () => {
    const context = useContext(LocationContext);
    if (!context) throw new Error("useLocation must be used within Providers");
    return context;
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within Providers");
    return context;
};
