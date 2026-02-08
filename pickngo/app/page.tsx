"use client";

import { useLocation } from "./providers";
import { MOCK_SHOPS, Shop } from "@/lib/mockData";
import Link from "next/link";
import { MapPin, Search, Star, Clock, Percent } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { robustFetch } from "@/lib/apiClient";
import { CardSkeleton } from "./components/ui/Skeleton";

export default function Home() {
  const { location, detectLocation } = useLocation();
  const [activeCategory, setActiveCategory] = useState("All");
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Supermarket", "Bakery", "Hotel", "Vegetables"];

  // Simulate Robust Data Fetching
  useEffect(() => {
    const loadShops = async () => {
      try {
        setLoading(true);
        // Simulate API call with retry logic
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

  const filteredShops = activeCategory === "All"
    ? shops
    : shops.filter(shop => shop.type === activeCategory);

  return (
    <div className="pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2" onClick={detectLocation}>
          <MapPin className="text-primary w-6 h-6" />
          <div className="flex-1">
            <p className="text-xs font-bold text-primary uppercase tracking-wide">Pickup From</p>
            <h2 className="text-sm font-semibold truncate text-gray-800 flex items-center gap-1">
              {location.address} <span className="text-xs text-gray-400">▼</span>
            </h2>
          </div>
          <Link href="/profile" className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
            {/* Profile Avatar Placeholder */}
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" />
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for hotels, supermarkets..."
            className="w-full bg-gray-100 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
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
            className="relative w-full h-40 rounded-2xl overflow-hidden shadow-lg premium-shadow bg-gradient-to-r from-orange-500 to-red-500"
          >
            <div className="absolute inset-0 flex items-center justify-between px-6 text-white">
              <div className="z-10">
                <h3 className="text-2xl font-black italic">50% OFF</h3>
                <p className="text-sm font-medium opacity-90">On first Hotel Order</p>
                <button className="mt-3 bg-white text-orange-600 px-4 py-1.5 rounded-full text-xs font-bold shadow-md">
                  Claim Now
                </button>
              </div>
              {/* Decorative Circles */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute left-10 -top-10 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
            </div>
          </motion.div>
        )}
      </section>

      {/* Categories */}
      <div className="flex gap-4 overflow-x-auto px-4 mt-6 no-scrollbar pb-2">
        {loading ? (
          Array(4).fill(0).map((_, i) => <div key={i} className="h-8 w-24 bg-gray-100 rounded-full animate-pulse flex-shrink-0" />)
        ) : (
          categories.map((cat, idx) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${activeCategory === cat
                ? "bg-gray-800 text-white shadow-md transform scale-105"
                : "bg-white border border-gray-200 text-gray-600 shadow-sm"
                }`}
            >
              {cat}
            </button>
          ))
        )}
      </div>

      {/* Shop List */}
      <section className="mt-6 px-4 space-y-6">
        <h3 className="text-lg font-bold text-gray-800">
          {activeCategory === "All" ? "Nearby Shops & Hotels" : `Nearby ${activeCategory}s`}
        </h3>

        {loading ? (
          <div className="space-y-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : filteredShops.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            No places found in this category.
          </div>
        ) : (
          filteredShops.map((shop) => (
            <Link href={`/shop/${shop.id}`} key={shop.id} className="block group">
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 w-full">
                  <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                  {/* Badges */}
                  {shop.offers && (
                    <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md flex items-center gap-1">
                      <Percent className="w-3 h-3" /> {shop.offers}
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="text-xl font-bold">{shop.name}</h4>
                    <p className="text-xs opacity-90">{shop.type}</p>
                  </div>

                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
                    <Clock className="w-3 h-3 text-green-600" /> {shop.time}
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-md border border-green-100">
                    <Star className="w-3 h-3 text-green-600 fill-green-600" />
                    <span className="text-xs font-bold text-green-700">{shop.rating}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">{shop.distance} km away</p>
                </div>
              </motion.div>
            </Link>
          ))
        )}
      </section>
    </div>
  );
}
