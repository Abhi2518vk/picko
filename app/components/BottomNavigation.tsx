"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/app/providers";
import { motion } from "framer-motion";

export function BottomNavigation() {
    const pathname = usePathname();

    // Hide bottom navigation on login page
    if (pathname === "/login") {
        return null;
    }

    const { totalItems } = useCart();

    const isActive = (path: string) => {
        if (path === "/" && pathname === "/") return true;
        if (path !== "/" && pathname.startsWith(path)) return true;
        return false;
    };

    const navItems = [
        { label: "Home", icon: Home, href: "/", id: "home" },
        { label: "Cart", icon: ShoppingCart, href: "/cart", id: "cart", badge: totalItems > 0 ? totalItems : null },
        { label: "Profile", icon: User, href: "/profile", id: "profile" },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-40 max-w-[480px] mx-auto w-full">
            <div className="flex justify-around items-center">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className="flex-1 py-3 flex flex-col items-center justify-center gap-1 relative transition-colors"
                        >
                            <motion.div
                                animate={{
                                    scale: active ? 1.1 : 1,
                                    color: active ? "rgb(229, 57, 53)" : "rgb(107, 114, 128)",
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <div className="relative">
                                    <Icon className="w-6 h-6" />
                                    {item.badge && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                                        >
                                            {item.badge}
                                        </motion.span>
                                    )}
                                </div>
                            </motion.div>
                            <span
                                className={`text-[11px] font-semibold transition-colors ${
                                    active ? "text-primary" : "text-gray-600"
                                }`}
                            >
                                {item.label}
                            </span>
                            {active && (
                                <motion.div
                                    layoutId="underline"
                                    className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-primary rounded-t-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
