"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, X } from "lucide-react";
import { useLocation } from "@/app/providers";
import { motion, AnimatePresence } from "framer-motion";

export function LocationSelector() {
    const { location, detectLocation, manualLocation } = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [manualInput, setManualInput] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Detect outside clicks to close dropdown
    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleMouseDown);
        }

        return () => {
            document.removeEventListener("mousedown", handleMouseDown);
        };
    }, [isOpen]);

    const handleDetect = async () => {
        detectLocation();
        setIsOpen(false);
    };

    const handleManualSubmit = () => {
        if (manualInput.trim()) {
            manualLocation(manualInput);
            setManualInput("");
            setIsOpen(false);
        }
    };

    return (
        <div className="relative">
            {/* Location Bar */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            >
                <MapPin className="text-primary w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-800 truncate flex-1 text-left">
                    {location.address}
                </span>
                <span className="text-gray-400 text-xs">▼</span>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={dropdownRef}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-100 z-30 overflow-hidden"
                    >
                        {/* Detect Location Option */}
                        <button
                            onClick={handleDetect}
                            className="w-full px-4 py-4 flex items-center gap-3 hover:bg-red-50 transition-colors border-b border-gray-100"
                        >
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="text-left flex-1">
                                <p className="text-sm font-bold text-gray-800">Detect My Location</p>
                                <p className="text-xs text-gray-500">Using GPS</p>
                            </div>
                        </button>

                        {/* Manual Location Option */}
                        <div className="px-4 py-4 border-b border-gray-100">
                            <p className="text-xs font-bold text-gray-600 uppercase mb-3 flex items-center gap-2">
                                <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    ✎
                                </span>
                                Enter Location
                            </p>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="e.g., MG Road, Bangalore"
                                    value={manualInput}
                                    onChange={(e) => setManualInput(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            handleManualSubmit();
                                        }
                                    }}
                                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder-gray-400"
                                />
                                <button
                                    onClick={handleManualSubmit}
                                    disabled={!manualInput.trim()}
                                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600 transition-colors"
                                >
                                    Set
                                </button>
                            </div>
                        </div>

                        {/* Current Location Display */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                        >
                            <p className="text-xs font-bold text-gray-600 uppercase mb-1">Current</p>
                            <p className="text-sm font-medium text-gray-800 truncate flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                                {location.address}
                            </p>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
