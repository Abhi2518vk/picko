"use client";

import { useCart } from "@/app/providers";
import { MOCK_SHOPS, Shop } from "@/lib/mockData";
import { ArrowLeft, Receipt, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function CartPage() {
    const { items, totalAmount, updateQuantity } = useCart();
    const router = useRouter();

    const shopsInCart = Array.from(new Set(items.map((item) => item.shopId)))
        .map((shopId) => MOCK_SHOPS.find((shop) => shop.id === shopId))
        .filter((shop): shop is Shop => Boolean(shop));

    const tax = totalAmount * 0.05;
    const finalAmount = totalAmount + tax;

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white">
                <div className="w-60 h-60 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" alt="Empty Cart" className="w-32 opacity-50" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Your Cart is Empty</h2>
                <p className="text-gray-400 text-center mt-2 text-sm">Looks like you haven't added anything yet.</p>
                <Link href="/" className="mt-8 bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg">
                    Browse Shops
                </Link>
            </div>
        );
    }

    return (
        // pb-64 ensures content is never hidden under the two fixed bars
        <div className="bg-gray-50 min-h-screen pb-64">

            {/* Header */}
            <header className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
                <button onClick={() => router.back()}>
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-bold text-gray-800">Your Cart</h1>
                    {shopsInCart.length > 0 ? (
                        <p className="text-xs text-gray-500">
                            Items from {shopsInCart.map((shop) => shop.name).join(", ")}
                        </p>
                    ) : (
                        <p className="text-xs text-gray-500">{items.length} item{items.length > 1 ? 's' : ''}</p>
                    )}
                </div>
            </header>

            <div className="p-4 space-y-4">
                {/* Cart Items */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="space-y-4">
                        {items.map((item) => (
                            <motion.div
                                key={item.id}
                                className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0"
                            >
                                <div className="flex items-start gap-2 flex-1">
                                    <div className="w-4 h-4 mt-1 border border-green-600 flex items-center justify-center rounded-[2px]">
                                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-800">{item.name}</h3>
                                        <p className="text-[11px] text-gray-500">{MOCK_SHOPS.find((shop) => shop.id === item.shopId)?.name || "Unknown shop"}</p>
                                        <p className="text-xs text-gray-500">₹{item.price}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-2 bg-green-50 border border-green-100 px-2 py-1 rounded-lg">
                                        <motion.button
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="text-green-700 font-bold px-2 py-1 hover:bg-green-100 rounded"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </motion.button>
                                        <motion.span
                                            key={item.quantity}
                                            initial={{ scale: 1.2 }}
                                            animate={{ scale: 1 }}
                                            className="text-sm font-bold text-green-700 w-6 text-center"
                                        >
                                            {item.quantity}
                                        </motion.span>
                                        <motion.button
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="text-green-700 font-bold px-2 py-1 hover:bg-green-100 rounded"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                    <motion.div
                                        key={`price-${item.id}-${item.quantity}`}
                                        initial={{ opacity: 0.5 }}
                                        animate={{ opacity: 1 }}
                                        className="text-sm font-medium text-gray-700 w-16 text-right"
                                    >
                                        ₹{item.price * item.quantity}
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Cancellation Policy */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2 mb-2">
                        <Receipt className="w-4 h-4" /> Cancellation Policy
                    </h3>
                    <p className="text-xs text-gray-400">
                        100% cancellation fee will be applicable if you decide to cancel the order anytime after order placement.
                    </p>
                </div>

                {/* Bill Details */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-800 mb-4">Bill Details</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Item Total</span>
                            <span>₹{totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Taxes & Charges</span>
                            <span>₹{tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 bg-green-50 p-2 rounded-lg -mx-2">
                            <span>Platform Fee</span>
                            <span className="text-green-600 font-bold">FREE</span>
                        </div>
                        {/* TO PAY ROW - big green amount */}
                        <div className="border-t border-gray-200 pt-3 mt-2 flex justify-between items-center">
                            <span className="text-base font-black text-gray-900">To Pay</span>
                            <motion.span
                                key={finalAmount}
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                className="text-2xl font-black text-green-600"
                            >
                                ₹{finalAmount.toFixed(2)}
                            </motion.span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 
                Checkout button fixed ABOVE bottom nav.
                Bottom nav is ~64px tall, so we use bottom-16 (64px).
                This button sits right on top of the nav bar.
            */}
            <div className="fixed bottom-16 left-0 right-0 max-w-[480px] mx-auto w-full px-4 z-30">
                <Link href="/checkout" className="block w-full">
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-2xl flex justify-between px-6 items-center"
                    >
                        <div className="flex flex-col items-start leading-tight">
                            <span className="text-xs opacity-80 font-normal">TOTAL</span>
                            <span>₹{finalAmount.toFixed(2)}</span>
                        </div>
                        <span>Review Order →</span>
                    </motion.button>
                </Link>
            </div>

        </div>
    );
}
