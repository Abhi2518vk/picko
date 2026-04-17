"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from "react";
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
    gender?: string;
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

    useEffect(() => {
        const savedUser = SafeStorage.getJSON<User>("user");
        if (savedUser) {
            setUserState(savedUser);
            setIsLoggedIn(true);
        }
        setAuthLoading(false);
    }, []);

    const setUser = useCallback((user: User | null) => {
        if (user) {
            SafeStorage.setJSON("user", user);
            setIsLoggedIn(true);
        } else {
            SafeStorage.removeItem("user");
            setIsLoggedIn(false);
        }
        setUserState(user);
    }, []);

    // Location State
    const [location, setLocationState] = useState<Location>(DEFAULT_LOCATION);

    const detectLocation = useCallback(() => {
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
    }, []);

    const manualLocation = useCallback((address: string, lat?: number, lng?: number) => {
        setLocationState({
            lat: lat || DEFAULT_LOCATION.lat,
            lng: lng || DEFAULT_LOCATION.lng,
            address,
        });
    }, []);

    // Cart State
    const [items, setItems] = useState<CartItem[]>([]);

    useEffect(() => {
        const savedCart = SafeStorage.getJSON<CartItem[]>("cart");
        if (savedCart && Array.isArray(savedCart)) {
            setItems(savedCart);
        }
    }, []);

    useEffect(() => {
        if (!user?.id || !firebaseInitialized) return;
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

    // Persist cart to SafeStorage immediately, and to Firebase asynchronously (never block UI)
    const persistCart = useCallback((newItems: CartItem[], currentUserId?: string) => {
        SafeStorage.setJSON("cart", newItems);
        if (currentUserId && firebaseInitialized) {
            // Defer Firebase update to next tick to avoid blocking UI
            setTimeout(() => {
                updateUserCart(currentUserId, newItems).catch((error) => {
                    console.error("Failed to persist cart to Firebase:", error);
                });
            }, 0);
        }
    }, []);

    // Memoize cart actions with stable dependencies
    const addToCart = useCallback((product: Product) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.id === product.id);
            const newItems = existing
                ? prev.map((item) =>
                      item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                  )
                : [...prev, { ...product, quantity: 1 }];
            // Persist after state update (non-blocking)
            persistCart(newItems, user?.id);
            return newItems;
        });
    }, [persistCart, user?.id]);

    const removeFromCart = useCallback((productId: string) => {
        setItems((prev) => {
            const newItems = prev.filter((i) => i.id !== productId);
            persistCart(newItems, user?.id);
            return newItems;
        });
    }, [persistCart, user?.id]);

    const updateQuantity = useCallback((productId: string, quantity: number) => {
        setItems((prev) => {
            const newItems = quantity <= 0
                ? prev.filter((i) => i.id !== productId)
                : prev.map((i) => (i.id === productId ? { ...i, quantity } : i));
            persistCart(newItems, user?.id);
            return newItems;
        });
    }, [persistCart, user?.id]);

    const clearCart = useCallback(() => {
        setItems([]);
        SafeStorage.removeItem("cart");
        if (user?.id && firebaseInitialized) {
            // Defer Firebase update to next tick
            setTimeout(() => {
                updateUserCart(user.id, []).catch(console.error);
            }, 0);
        }
    }, [user?.id]);

    const logout = useCallback(() => {
        setUser(null);
        setItems([]);
        SafeStorage.removeItem("cart");
    }, [setUser]);

    const totalAmount = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
    const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

    // Memoized context values to prevent unnecessary re-renders (fixes slow selection bug)
    const cartValue = useMemo(
        () => ({
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalAmount,
            totalItems,
        }),
        [items, addToCart, removeFromCart, updateQuantity, clearCart, totalAmount, totalItems]
    );

    const authValue = useMemo(() => ({
        user, setUser, logout, isLoggedIn, loading: authLoading
    }), [user, setUser, logout, isLoggedIn, authLoading]);

    const locationValue = useMemo(() => ({
        location, setLocation: setLocationState, detectLocation, manualLocation
    }), [location, detectLocation, manualLocation]);

    const hasValidGoogleClientId =
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID &&
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID !== "123456789012-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com";

    const providerContent = (
        <AuthContext.Provider value={authValue}>
            <LocationContext.Provider value={locationValue}>
                <CartContext.Provider value={cartValue}>
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
