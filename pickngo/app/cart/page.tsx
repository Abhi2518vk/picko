"use client";

import { useCart } from "../providers";
import { ArrowLeft, Clock, MapPin, Receipt } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const { items, totalAmount, addToCart, removeFromCart } = useCart();
    const router = useRouter();

    const tax = totalAmount * 0.05; // 5% Mock Tax
    const finalAmount = totalAmount + tax;

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white">
                <div className="w-60 h-60 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" alt="Empty Cart" className="w-32 opacity-50" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Your Cart is Empty</h2>
                <p className="text-gray-400 text-center mt-2 text-sm">Looks like you haven't added anything yet.</p>
                <Link href="/" className="mt-8 bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">
                    Browse Shops
                </Link>
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
                <div className="flex-1">
                    <h1 className="text-lg font-bold text-gray-800">Your Cart</h1>
                    <p className="text-xs text-gray-500">{items[0].name.split(' ')[0]}'s Store</p>
                </div>
            </header>

            {/* Items List */}
            <div className="p-4 space-y-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    {items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center py-4 border-b border-dashed border-gray-100 last:border-0">
                            <div className="flex items-start gap-2">
                                <div className="w-4 h-4 mt-1 border border-green-600 flex items-center justify-center rounded-[2px]"><div className="w-2 h-2 bg-green-600 rounded-full"></div></div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800">{item.name}</h3>
                                    <p className="text-xs text-gray-500">₹{item.price}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-green-50 border border-green-100 px-2 py-1 rounded-lg">
                                <button onClick={() => removeFromCart(item.id)} className="text-green-700 font-bold px-2">-</button>
                                <span className="text-sm font-bold text-green-700">{item.quantity}</span>
                                <button onClick={() => addToCart(item)} className="text-green-700 font-bold px-2">+</button>
                            </div>
                            <div className="text-sm font-medium text-gray-700 w-12 text-right">
                                ₹{item.price * item.quantity}
                            </div>
                        </div>
                    ))}
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
                            <span>₹{totalAmount}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Taxes & Charges</span>
                            <span>₹{tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 bg-green-50 p-2 rounded-lg -mx-2">
                            <span>Platform Fee</span>
                            <span className="text-green-600 font-bold">FREE</span>
                        </div>
                        <div className="border-t border-gray-200 my-2 pt-2 flex justify-between text-base font-bold text-gray-900">
                            <span>To Pay</span>
                            <span>₹{finalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pay Button */}
            <div className="fixed bottom-0 w-full bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-3xl max-w-[480px]">
                <Link href="/checkout" className="block w-full">
                    <button className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-green-700 transition-colors flex justify-between px-6 items-center">
                        <div className="flex flex-col items-start leading-tight">
                            <span className="text-xs opacity-80 font-normal">TOTAL</span>
                            <span>₹{finalAmount.toFixed(2)}</span>
                        </div>
                        <span className="flex items-center gap-2">Proceed to Pay <ArrowLeft className="w-5 h-5 rotate-180" /></span>
                    </button>
                </Link>
            </div>
        </div>
    );
}
