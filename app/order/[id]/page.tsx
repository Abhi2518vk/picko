"use client";

import { useParams } from "next/navigation";
import { CheckCircle, MapPin, Share2, Home } from "lucide-react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";

export default function OrderSuccess() {
    const { id } = useParams();
    const shopName = "Fresh Mart Supermarket"; // Mock shop name since we lost context on reload for this page

    return (
        <div className="bg-green-50 min-h-screen flex flex-col items-center pt-10 px-6 pb-24 text-center">
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
            >
                <CheckCircle className="w-20 h-20 text-green-600 mb-4 drop-shadow-md" />
            </motion.div>

            <h1 className="text-2xl font-black text-gray-800">Order Successful!</h1>
            <p className="text-gray-600 mt-1">Ready for pickup at <span className="font-bold">{shopName}</span></p>

            {/* Ticket Card */}
            <div className="mt-8 bg-white p-6 rounded-3xl shadow-xl w-full max-w-sm relative overflow-hidden border border-gray-100">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-600"></div>

                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Pickup Ticket</h2>

                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-white rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.05)] border border-gray-100">
                        <QRCodeSVG value={`ORDER-${id}`} size={160} />
                    </div>
                </div>

                <p className="text-sm font-bold text-gray-500 mb-1">Order ID</p>
                <p className="text-2xl font-mono font-black text-gray-800 tracking-wider">#{id}</p>

                <div className="my-6 border-b-2 border-dashed border-gray-100 relative">
                    <div className="absolute -left-8 -top-3 w-6 h-6 bg-green-50 rounded-full"></div>
                    <div className="absolute -right-8 -top-3 w-6 h-6 bg-green-50 rounded-full"></div>
                </div>

                <div className="flex justify-between items-end">
                    <div className="text-left">
                        <p className="text-xs text-gray-400 font-bold uppercase">Status</p>
                        <p className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-md mt-1">Confirmed</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400 font-bold uppercase">Secret PIN</p>
                        <p className="text-xl font-bold text-gray-800">4 8 2 9</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-8 w-full max-w-sm flex flex-col gap-3">
                <Link href={`https://www.google.com/maps/search/?api=1&query=12.9716,77.5946`} target="_blank" rel="noopener noreferrer" className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                    <MapPin className="w-5 h-5" /> Navigate to Shop
                </Link>

                <Link href="/" className="w-full bg-white text-gray-700 py-3.5 rounded-xl font-bold shadow-sm border border-gray-200 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                    <Home className="w-5 h-5" /> Back to Home
                </Link>
            </div>
        </div>
    );
}
