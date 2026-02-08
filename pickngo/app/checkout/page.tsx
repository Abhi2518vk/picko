"use client";

import { useCart } from "../providers";
import { ArrowLeft, CreditCard, Banknote, Smartphone, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

export default function CheckoutPage() {
    const { totalAmount, clearCart } = useCart();
    const router = useRouter();
    const [processing, setProcessing] = useState(false);

    // Calculate final amount again (mock)
    const finalAmount = totalAmount + (totalAmount * 0.05);

    const handlePayment = () => {
        setProcessing(true);
        setTimeout(() => {
            clearCart();
            const orderId = Math.floor(Math.random() * 1000000); // Random Order ID
            router.push(`/order/${orderId}`);
        }, 2000); // 2s Fake Processing
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <header className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
                <button onClick={() => router.back()}>
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-lg font-bold text-gray-800">Select Payment</h1>
            </header>

            <div className="p-4 space-y-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center mb-6">
                    <p className="text-gray-500 text-sm">Amount to Pay</p>
                    <h2 className="text-4xl font-black text-gray-900 mt-1">₹{finalAmount.toFixed(0)}</h2>
                </div>

                <h3 className="text-sm font-bold text-gray-500 uppercase ml-1">Payment Methods</h3>

                <div className="space-y-3">
                    <PaymentOption icon={<Smartphone className="text-blue-600" />} title="UPI" sub="Google Pay, PhonePe, Paytm" onClick={handlePayment} />
                    <PaymentOption icon={<CreditCard className="text-orange-600" />} title="Cards" sub="Visa, Mastercard, RuPay" onClick={handlePayment} />
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
        <button onClick={onClick} className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:border-primary/50 hover:bg-gray-50 transition-all text-left group">
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                {icon}
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-gray-800">{title}</h4>
                <p className="text-xs text-gray-500">{sub}</p>
            </div>
            <div className="w-4 h-4 rounded-full border border-gray-300 group-hover:border-primary group-hover:bg-primary/10"></div>
        </button>
    );
}
