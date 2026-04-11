"use client";

import { useAuth } from "./providers/index";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isLoggedIn, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const publicRoutes = ["/login"];

    useEffect(() => {
        if (!loading && !isLoggedIn && !publicRoutes.includes(pathname)) {
            router.replace("/login");
        }
    }, [isLoggedIn, loading, pathname]);

    // Show splash screen while checking auth
    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <ShoppingBag className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-black text-gray-900">PickNGo</h1>
                <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin mt-2" />
            </div>
        );
    }

    // If not logged in and not on a public route, render nothing (redirect happening)
    if (!isLoggedIn && !publicRoutes.includes(pathname)) {
        return null;
    }

    return <>{children}</>;
}
