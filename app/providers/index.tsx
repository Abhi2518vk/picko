"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/lib/mockData";
import { getUserCart, updateUserCart, firebaseInitialized } from "@/lib/firebase";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SafeStorage } from "@/lib/storage";

// --- Auth Context ---
export type User = {
    id: string;
    name: string;
    email: string;
    image: string;
    gender?: string; // 'male', 'female', 'other'
};

type AuthContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
    isLoggedIn: boolean;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    manualLocation: (address: string, lat?: number, lng?: number) => void;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

// --- Cart Context ---
export type CartItem = Product & { quantity: number };

type CartContextType = {
    items: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    totalAmount: number;
    totalItems: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// --- Providers ---
export function Providers({ children }: { children: ReactNode }) {
    // Auth State
    const [user, setUserState] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = SafeStorage.getJSON<User>("user");
        if (savedUser) {
            setUserState(savedUser);
            setIsLoggedIn(true);
        }
        setAuthLoading(false);
    }, []);

    const setUser = (user: User | null) => {
        if (user) {
            SafeStorage.setJSON("user", user);
            setIsLoggedIn(true);
        } else {
            SafeStorage.removeItem("user");
            setIsLoggedIn(false);
        }
        setUserState(user);
    };

    const logout = () => {
        setUser(null);
        setItems([]);
        SafeStorage.removeItem("cart");
    };

    // Location State
    const [location, setLocationState] = useState<Location>(DEFAULT_LOCATION);

    const detectLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocationState({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        address: `${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`,
                    });
                },
                (error) => {
                    console.error("Error detecting location", error);
                    alert("Unable to detect location. Please enter manually.");
                }
            );
        }
    };

    const manualLocation = (address: string, lat?: number, lng?: number) => {
        setLocationState({
            lat: lat || DEFAULT_LOCATION.lat,
            lng: lng || DEFAULT_LOCATION.lng,
            address: address,
        });
    };

    // Cart State with localStorage persistence
    const [items, setItems] = useState<CartItem[]>([]);
    const [cartLoading, setCartLoading] = useState(true);

    useEffect(() => {
        const savedCart = SafeStorage.getJSON<CartItem[]>("cart");
        if (savedCart) {
            setItems(savedCart);
        }
        setCartLoading(false);
    }, []);

    useEffect(() => {
        if (!user?.id || !firebaseInitialized) {
            return;
        }

        getUserCart(user.id)
            .then((cartData) => {
                const userCart = cartData?.items;
                if (Array.isArray(userCart)) {
                    setItems(userCart);
                    SafeStorage.setJSON("cart", userCart);
                }
            })
            .catch((error) => {
                console.error("Failed to sync cart from Firebase:", error);
            });
    }, [user?.id]);

    const persistCart = (newItems: CartItem[]) => {
        setItems(newItems);
        SafeStorage.setJSON("cart", newItems);

        if (user?.id && firebaseInitialized) {
            updateUserCart(user.id, newItems).catch((error) => {
                console.error("Failed to persist cart to Firebase:", error);
            });
        }
    };

    const addToCart = (product: Product) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.id === product.id);
            const newItems = existing
                ? prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
                : [...prev, { ...product, quantity: 1 }];
            persistCart(newItems);
            return newItems;
        });
    };

    const removeFromCart = (productId: string) => {
        setItems((prev) => {
            const newItems = prev.filter((i) => i.id !== productId);
            persistCart(newItems);
            return newItems;
        });
    };

    const updateQuantity = (productId: string, quantity: number) => {
        setItems((prev) => {
            const newItems = quantity <= 0
                ? prev.filter((i) => i.id !== productId)
                : prev.map((i) => (i.id === productId ? { ...i, quantity } : i));
            persistCart(newItems);
            return newItems;
        });
    };

    const clearCart = () => {
        setItems([]);
        SafeStorage.removeItem("cart");
        if (user?.id && firebaseInitialized) {
            updateUserCart(user.id, []).catch((error) => {
                console.error("Failed to clear cart in Firebase:", error);
            });
        }
    };

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    // Check if Google OAuth is properly configured
    const hasValidGoogleClientId = 
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && 
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID !== "123456789012-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com";

    const providerContent = (
        <AuthContext.Provider value={{ user, setUser, logout, isLoggedIn, loading: authLoading }}>
            <LocationContext.Provider value={{ location, setLocation: setLocationState, detectLocation, manualLocation }}>
                <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, updateQuantity, totalAmount, totalItems }}>
                    {children}
                </CartContext.Provider>
            </LocationContext.Provider>
        </AuthContext.Provider>
    );

    return hasValidGoogleClientId ? (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
            {providerContent}
        </GoogleOAuthProvider>
    ) : (
        providerContent
    );
}

// --- Hooks ---
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within Providers");
    return context;
};

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