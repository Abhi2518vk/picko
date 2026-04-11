"use client";

import { ArrowLeft, Package, Settings, HelpCircle, ChevronRight, MapPin, LogOut, Bell, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/app/providers";

export default function ProfilePage() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState("orders");
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    if (!user) {
        return null;
    }

    // Mock Past Orders
    const pastOrders = [
        { id: "4521", shop: "Empire Hotel", items: "Chicken Biryani x2", price: 560, date: "Today, 1:30 PM", status: "Picked Up" },
        { id: "3892", shop: "Fresh Mart", items: "Milk, Bread, Eggs", price: 120, date: "Yesterday, 6:00 PM", status: "Delivered" },
        { id: "3100", shop: "Oven Fresh", items: "Chocolate Cake", price: 450, date: "2 Feb, 10:00 AM", status: "Picked Up" },
    ];

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    // Get first letter of name
    const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : "U";

    const getBgColor = () => {
        if (user.gender === "male") {
            return "bg-blue-100";
        } else if (user.gender === "female") {
            return "bg-pink-100";
        } else {
            return "bg-gray-100";
        }
    };

    const getTextColor = () => {
        if (user.gender === "male") {
            return "text-blue-700";
        } else if (user.gender === "female") {
            return "text-pink-700";
        } else {
            return "text-gray-700";
        }
    };

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
            </header>

            {/* User Card */}
            <div className="p-4">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-red-50 to-red-50 p-6 rounded-3xl shadow-sm border border-red-100"
                >
                    <div className="flex items-center gap-4">
                        <motion.div
                            animate={{ scale: 1 }}
                            initial={{ scale: 0.8 }}
                            className={`w-16 h-16 rounded-full p-1 flex-shrink-0 font-bold text-lg flex items-center justify-center ${getBgColor()} ${getTextColor()}`}
                        >
                            {user.image ? (
                                <img src={user.image} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                firstLetter
                            )}
                        </motion.div>
                        <div>
                            <h2 className="text-xl font-black text-gray-800">{user.name}</h2>
                            <p className="text-sm text-gray-600 font-medium">{user.email}</p>
                            {user.gender && user.gender !== "other" && (
                                <div className="mt-2 flex items-center gap-2">
                                    <span className={`text-xs font-bold uppercase px-2 py-1 rounded-md ${
                                        user.gender === "male"
                                            ? "bg-blue-100 text-blue-700"
                                            : user.gender === "female"
                                            ? "bg-pink-100 text-pink-700"
                                            : "bg-gray-100 text-gray-700"
                                    }`}>
                                        {user.gender}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Quick Actions (Competitor Style) */}
            <div className="grid grid-cols-2 gap-4 px-4 mb-6">
                <QuickAction icon={<Package className="text-blue-600" />} label="Orders" onClick={() => setActiveTab("orders")} active={activeTab === "orders"} />
                <QuickAction icon={<HelpCircle className="text-red-600" />} label="Help" onClick={() => setActiveTab("help")} active={activeTab === "help"} />
                <QuickAction icon={<MapPin className="text-green-600" />} label="Addresses" onClick={() => setActiveTab("addresses")} active={activeTab === "addresses"} />
                <QuickAction icon={<Settings className="text-gray-600" />} label="Settings" onClick={() => setActiveTab("settings")} active={activeTab === "settings"} />
            </div>

            {/* Content Area */}
            <div className="px-4">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                >
                    {activeTab === "orders" && (
                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-800 text-lg">Past Orders</h3>
                            {pastOrders.map((order, idx) => (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-bold text-gray-800">{order.shop}</h4>
                                            <p className="text-xs text-gray-500">{order.items}</p>
                                        </div>
                                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-md">{order.status}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-t border-gray-50 pt-3 mt-2">
                                        <p className="text-xs text-gray-400">{order.date}</p>
                                        <p className="font-bold text-gray-800">₹{order.price}</p>
                                    </div>
                                    <button className="w-full mt-3 text-sm font-bold text-red-600 border border-red-200 py-2 rounded-xl hover:bg-red-50 transition-colors">
                                        Reorder
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {activeTab === "help" && (
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                            <h3 className="font-bold text-gray-800 text-lg">Help & Support</h3>
                            {["I have a payment issue", "Can I edit my order?", "Where is my refund?", "Contact Customer Care"].map((q, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ backgroundColor: "rgba(229, 57, 53, 0.05)" }}
                                    className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0 cursor-pointer px-2 -mx-2 rounded-lg transition-colors"
                                >
                                    <span className="text-sm font-medium text-gray-700">{q}</span>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {activeTab === "settings" && (
                        <div className="space-y-4">
                            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-4">Preferences</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                <Bell className="w-5 h-5" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">Push Notifications</span>
                                        </div>
                                        <motion.button
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                                            className={`w-12 h-7 rounded-full relative transition-colors ${notificationsEnabled ? "bg-green-500" : "bg-gray-300"}`}
                                        >
                                            <motion.div
                                                className="absolute w-5 h-5 bg-white rounded-full top-1 transition-all"
                                                style={{ left: notificationsEnabled ? "calc(100% - 6px)" : "6px" }}
                                            />
                                        </motion.button>
                                    </div>
                                    <div className="flex justify-between items-center py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                                <Lock className="w-5 h-5" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">Two-Factor Authentication</span>
                                        </div>
                                        <motion.button
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                                            className={`w-12 h-7 rounded-full relative transition-colors ${twoFactorEnabled ? "bg-green-500" : "bg-gray-300"}`}
                                        >
                                            <motion.div
                                                className="absolute w-5 h-5 bg-white rounded-full top-1 transition-all"
                                                style={{ left: twoFactorEnabled ? "calc(100% - 6px)" : "6px" }}
                                            />
                                        </motion.button>
                                    </div>
                                </div>
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={handleLogout}
                                className="w-full bg-white text-red-600 py-4 rounded-2xl font-bold shadow-sm border border-red-50 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 group"
                            >
                                <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" /> Log Out
                            </motion.button>
                        </div>
                    )}

                    {/* Fallback for Addresses */}
                    {activeTab === "addresses" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-10 bg-white rounded-2xl shadow-sm border border-gray-100"
                        >
                            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                                <MapPin className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-gray-800 font-bold">No Saved Addresses</h3>
                            <p className="text-gray-400 text-sm mt-1">Since this is a Pickup app, you don't really need them!</p>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

function QuickAction({ icon, label, onClick, active }: { icon: any, label: string, onClick: () => void, active: boolean }) {
    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`p-6 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all duration-300 ${
                active ? "bg-white border-red-500 shadow-md scale-[1.02] bg-gradient-to-br from-red-50 to-white" : "bg-white border-gray-100 shadow-sm hover:border-gray-200 hover:shadow-md"
            }`}
        >
            <motion.div
                animate={{ scale: active ? 1.1 : 1 }}
                className={`p-2 rounded-full ${active ? "bg-red-50" : "bg-gray-50"}`}
            >
                {icon}
            </motion.div>
            <span className={`text-xs font-bold ${active ? "text-red-600" : "text-gray-600"}`}>{label}</span>
        </motion.button>
    );
}
