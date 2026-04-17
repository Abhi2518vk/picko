"use client";

import { useLocation } from "./providers/index";
import { MOCK_SHOPS, Shop } from "@/lib/mockData";
import Link from "next/link";
import { MapPin, Search, Star, Clock, Percent, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { robustFetch } from "@/lib/apiClient";
import { LocationSelector } from "./components/LocationSelector";
import { ProfileAvatar } from "./components/ProfileAvatar";
import { useCart } from "./providers/index";
import Image from "next/image";

export default function Home() {
  const { location, detectLocation } = useLocation();
  const { totalItems } = useCart();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("All");

  const shopTypes = ["All", "Hotels", "Supermarket", "Bakery", "Vegetables"];

  useEffect(() => {
    const loadShops = async () => {
      try {
        setLoading(true);
        const data = await robustFetch(MOCK_SHOPS);
        setShops(data);
      } catch (err) {
        console.error("Failed to load shops", err);
      } finally {
        setLoading(false);
      }
    };
    loadShops();
  }, []);

  const filteredShops = selectedType === "All" 
    ? shops 
    : shops.filter(shop => shop.type === selectedType);

  return (
    <div className="pb-24 min-h-screen bg-gradient-to-br from-[#fafafa] via-[#f8f8f8] to-[#f5f5f7]">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong p-4 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1">
            <p className="text-xs font-bold text-primary uppercase tracking-wide mb-1">Pickup From</p>
            <LocationSelector />
          </div>
          <ProfileAvatar />
          <Link href="/cart" className="relative p-2 cart-btn rounded-full transition-all shadow-md hover:shadow-lg">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-600 to-red-700 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg"
              >
                {totalItems}
              </motion.span>
            )}
          </Link>
        </div>
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for shops, hotels, supermarkets..."
            className="w-full bg-white/80 backdrop-blur-sm rounded-2xl py-3.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all font-medium shadow-sm border border-gray-100/50"
          />
        </div>
      </header>

      {/* Promotional Banner */}
      <section className="mt-4 px-4">
        {loading ? (
          <div className="h-40 w-full bg-gray-100 rounded-2xl animate-pulse" />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full h-40 rounded-2xl overflow-hidden shadow-xl premium-shadow-lg bg-gradient-to-r from-red-500 via-red-600 to-orange-500"
          >
            <div className="absolute inset-0 flex items-center justify-between px-6 text-white">
              <div className="z-10">
                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-black italic"
                >
                  50% OFF
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm font-medium opacity-90"
                >
                  On first Hotel Order
                </motion.p>
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-3 bg-white text-red-600 px-5 py-2 rounded-full text-xs font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  Claim Now
                </motion.button>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute left-10 -top-10 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
            </div>
          </motion.div>
        )}
      </section>

      {/* Category Filter */}
      <section className="px-4 py-3">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {shopTypes.map((type) => (
            <motion.button
              key={type}
              onClick={() => setSelectedType(type)}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm transition-all ${
                selectedType === type
                  ? "bg-red-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {type}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Shop List */}
      <section className="mt-2 px-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">
            {selectedType === "All" ? "Nearby Shops & Hotels" : selectedType}
          </h3>
          <span className="text-xs text-gray-500 font-medium">{filteredShops.length} places</span>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
            <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
          </div>
        ) : filteredShops.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No places found for this category.</div>
        ) : (
          filteredShops.map((shop) => (
            <Link href={`/shop/${shop.id}`} key={shop.id} className="block group">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100/50 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-44 w-full">
                  <Image
                    src={shop.image}
                    alt={shop.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  {shop.offers && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-lg flex items-center gap-1">
                      <Percent className="w-3 h-3" />
                      {shop.offers}
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 text-white">
                    <h4 className="text-lg font-bold">{shop.name}</h4>
                    <p className="text-xs opacity-90">{shop.type}</p>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-lg">
                    <Clock className="w-3 h-3 text-green-600" />
                    {shop.time}
                  </div>
                </div>
                <div className="p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 bg-green-50 px-2.5 py-1 rounded-lg border border-green-100">
                    <Star className="w-3.5 h-3.5 text-green-600 fill-green-600" />
                    <span className="text-xs font-bold text-green-700">{shop.rating}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">{shop.distance} km</p>
                </div>
              </motion.div>
            </Link>
          ))
        )}
      </section>
    </div>
  );
}
