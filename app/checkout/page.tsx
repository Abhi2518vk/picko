"use client";

import { useAuth, useCart } from "@/app/providers";
import { MOCK_SHOPS, Shop } from "@/lib/mockData";
import { createOrder, firebaseInitialized } from "@/lib/firebase";
import { ArrowLeft, CreditCard, Banknote, Smartphone, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";

export default function CheckoutPage() {
    const { items, updateQuantity, totalAmount, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [processing, setProcessing] = useState(false);
    const [checkoutError, setCheckoutError] = useState("");
    const shopsInOrder = Array.from(new Set(items.map((item) => item.shopId)))
        .map((shopId) => MOCK_SHOPS.find((shop) => shop.id === shopId))
        .filter((shop): shop is Shop => Boolean(shop));

    // Calculate final amount again (mock)
    const tax = totalAmount * 0.05;
    const finalAmount = totalAmount + tax;

    const handlePayment = async () => {
        if (items.length === 0) {
            alert("Your cart is empty. Please add items before checkout.");
            return;
        }

        setCheckoutError("");
        setProcessing(true);

        try {
            const orderData = {
                userId: user?.id || "guest",
                items,
                shops: shopsInOrder.map((shop) => shop.name),
                totalAmount,
                tax,
                finalAmount,
                status: "pending",
            };

            const orderId = firebaseInitialized
                ? await createOrder(orderData)
                : `mock-order-${Math.floor(Math.random() * 1000000)}`;

            clearCart();
            router.push(`/order/${orderId}`);
        } catch (error) {
            console.error("Checkout failed:", error);
            setCheckoutError("Unable to place the order right now. Please try again.");
        } finally {
            setProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white">
                <div className="w-60 h-60 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" alt="Empty Cart" className="w-32 opacity-50" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Your Cart is Empty</h2>
                <p className="text-gray-400 text-center mt-2 text-sm">Add items from shops before checkout.</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-32">
            {/* Header */}
            <header className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
                <button onClick={() => router.back()}>
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-lg font-bold text-gray-800">Order Review</h1>
            </header>

            <div className="p-4 space-y-4">
                {shopsInOrder.length > 0 && (
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">Ordering from</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {shopsInOrder.map((shop) => (
                                <span key={shop.id} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                                    {shop.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                {checkoutError && (
                    <div className="bg-red-50 text-red-700 border border-red-100 p-4 rounded-2xl shadow-sm">
                        {checkoutError}
                    </div>
                )}
                {/* Items with Quantity Controls */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4">Items</h3>
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
                                        <p className="text-xs text-gray-500">₹{item.price}</p>
                                    </div>
                                </div>

                                {/* Quantity Controls with Instant Update */}
                                <div className="flex items-center gap-2">
                                    <motion.div
                                        className="flex items-center gap-2 bg-green-50 border border-green-100 px-2 py-1 rounded-lg"
                                        key={`${item.id}-${item.quantity}`}
                                    >
                                        <motion.button
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="text-green-700 font-bold px-2 py-1 hover:bg-green-100 rounded transition-colors"
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
                                            className="text-green-700 font-bold px-2 py-1 hover:bg-green-100 rounded transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </motion.button>
                                    </motion.div>
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

                {/* Amount Section as Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center mb-6">
                    <p className="text-gray-500 text-sm">Amount to Pay</p>
                    <motion.h2
                        key={finalAmount}
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="text-4xl font-black text-gray-900 mt-1"
                    >
                        ₹{finalAmount.toFixed(0)}
                    </motion.h2>
                </div>

                {/* Bill Details */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-800 mb-4">Bill Details</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Item Total</span>
                            <motion.span key={totalAmount} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }}>
                                ₹{totalAmount.toFixed(2)}
                            </motion.span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Taxes & Charges</span>
                            <motion.span key={tax} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }}>
                                ₹{tax.toFixed(2)}
                            </motion.span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 bg-green-50 p-2 rounded-lg -mx-2">
                            <span>Platform Fee</span>
                            <span className="text-green-600 font-bold">FREE</span>
                        </div>
                        <div className="border-t border-gray-200 my-2 pt-2 flex justify-between text-base font-bold text-gray-900">
                            <span>To Pay</span>
                            <motion.span key={finalAmount} initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
                                ₹{finalAmount.toFixed(2)}
                            </motion.span>
                        </div>
                    </div>
                </div>

                <h3 className="text-sm font-bold text-gray-500 uppercase ml-1 mt-6">Payment Methods</h3>

                <div className="space-y-3 pb-20">
                    <PaymentOption icon={<Smartphone className="text-blue-600" />} title="UPI" sub="Google Pay, PhonePe, Paytm" onClick={handlePayment} />
                    <PaymentOption icon={<CreditCard className="text-red-600" />} title="Cards" sub="Visa, Mastercard, RuPay" onClick={handlePayment} />
                    <PaymentOption icon={<Banknote className="text-green-600" />} title="Pay on Pickup" sub="Cash or QR at Shop" onClick={handlePayment} />
                </div>
            </div>

            {/* Processing Overlay */}
            {processing && (
                <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mb-4"
                    />
                    <h3 className="text-xl font-bold text-gray-800">Processing Payment...</h3>
                    <p className="text-gray-500 text-sm">Do not press back or close</p>
                </div>
            )}
        </div>
    );
}

function PaymentOption({ icon, title, sub, onClick }: { icon: any, title: string, sub: string, onClick: () => void }) {
    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:border-primary/50 hover:bg-gray-50 transition-all text-left group"
        >
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                {icon}
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-gray-800">{title}</h4>
                <p className="text-xs text-gray-500">{sub}</p>
            </div>
            <div className="w-4 h-4 rounded-full border border-gray-300 group-hover:border-primary group-hover:bg-primary/10"></div>
        </motion.button>
    );
}
