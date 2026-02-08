"use client";

import { ArrowLeft, Package, Settings, HelpCircle, ChevronRight, MapPin, LogOut, Bell, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ProfilePage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("orders");

    // Mock User
    const user = {
        name: "Abhilash",
        phone: "+91 98765 43210",
        email: "abhilash@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    };

    // Mock Past Orders
    const pastOrders = [
        { id: "4521", shop: "Empire Hotel", items: "Chicken Biryani x2", price: 560, date: "Today, 1:30 PM", status: "Picked Up" },
        { id: "3892", shop: "Fresh Mart", items: "Milk, Bread, Eggs", price: 120, date: "Yesterday, 6:00 PM", status: "Delivered" },
        { id: "3100", shop: "Oven Fresh", items: "Chocolate Cake", price: 450, date: "2 Feb, 10:00 AM", status: "Picked Up" },
    ];

    return (
        <div className="bg-gray-50 min-h-screen pb-24">
            {/* Header */}
            <header className="bg-white p-4 sticky top-0 z-10 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()}>
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-800">My Profile</h1>
                </div>
                <button className="text-sm font-bold text-gray-500">Edit</button>
            </header>

            {/* User Card */}
            <div className="p-4">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-orange-100 p-1">
                        <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-800">{user.name}</h2>
                        <p className="text-sm text-gray-500 font-medium">{user.phone}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions (Competitor Style) */}
            <div className="grid grid-cols-2 gap-4 px-4 mb-6">
                <QuickAction icon={<Package className="text-blue-600" />} label="Orders" onClick={() => setActiveTab("orders")} active={activeTab === "orders"} />
                <QuickAction icon={<HelpCircle className="text-orange-600" />} label="Help" onClick={() => setActiveTab("help")} active={activeTab === "help"} />
                <QuickAction icon={<MapPin className="text-green-600" />} label="Addresses" onClick={() => setActiveTab("addresses")} active={activeTab === "addresses"} />
                <QuickAction icon={<Settings className="text-gray-600" />} label="Settings" onClick={() => setActiveTab("settings")} active={activeTab === "settings"} />
            </div>

            {/* Content Area */}
            <div className="px-4">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    {activeTab === "orders" && (
                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-800 text-lg">Past Orders</h3>
                            {pastOrders.map((order) => (
                                <div key={order.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-bold text-gray-800">{order.shop}</h4>
                                            <p className="text-xs text-gray-500">{order.items}</p>
                                        </div>
                                        <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-md">{order.status}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-t border-gray-50 pt-3 mt-2">
                                        <p className="text-xs text-gray-400">{order.date}</p>
                                        <p className="font-bold text-gray-800">₹{order.price}</p>
                                    </div>
                                    <button className="w-full mt-3 text-sm font-bold text-primary border border-primary/20 py-2 rounded-xl hover:bg-orange-50 transition-colors">
                                        Reorder
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "help" && (
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                            <h3 className="font-bold text-gray-800 text-lg">Help & Support</h3>
                            {["I have a payment issue", "Can I edit my order?", "Where is my refund?", "Contact Customer Care"].map((q, i) => (
                                <div key={i} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors">
                                    <span className="text-sm font-medium text-gray-700">{q}</span>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "settings" && (
                        <div className="space-y-4">
                            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-4">Preferences</h3>
                                <div className="flex justify-between items-center py-2">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Bell className="w-4 h-4" /></div>
                                        <span className="text-sm font-medium text-gray-700">Push Notifications</span>
                                    </div>
                                    <div className="w-10 h-6 bg-green-500 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                                </div>
                            </div>

                            <button className="w-full bg-white text-red-600 py-4 rounded-2xl font-bold shadow-sm border border-red-50 hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                                <LogOut className="w-5 h-5" /> Log Out
                            </button>
                        </div>
                    )}

                    {/* Fallback for Addresses */}
                    {activeTab === "addresses" && (
                        <div className="text-center py-10">
                            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                                <MapPin className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-gray-800 font-bold">No Saved Addresses</h3>
                            <p className="text-gray-400 text-sm mt-1">Since this is a Pickup app, you don't really need them!</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

function QuickAction({ icon, label, onClick, active }: { icon: any, label: string, onClick: () => void, active: boolean }) {
    return (
        <button
            onClick={onClick}
            className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all duration-300 ${active ? "bg-white border-primary shadow-md scale-[1.02]" : "bg-white border-gray-100 shadow-sm hover:border-gray-200"
                }`}
        >
            <div className={`p-2 rounded-full ${active ? "bg-orange-50" : "bg-gray-50"}`}>
                {icon}
            </div>
            <span className={`text-xs font-bold ${active ? "text-primary" : "text-gray-600"}`}>{label}</span>
        </button>
    );
}
