"use client";

import { ArrowLeft, Apple, Leaf, Coffee, ShoppingBag, Pizza, IceCream, Utensils, Wine, Grid, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MOCK_SHOPS, Shop } from "@/lib/mockData";
import { robustFetch } from "@/lib/apiClient";

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  description: string;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  const categories: Category[] = [
    {
      id: "fruits",
      name: "Fruits",
      icon: <Apple className="w-6 h-6" />,
      color: "text-red-500",
      gradient: "from-red-50 to-pink-50",
      description: "Fresh fruits delivered to your doorstep",
    },
    {
      id: "vegetables",
      name: "Vegetables",
      icon: <Leaf className="w-6 h-6" />,
      color: "text-green-500",
      gradient: "from-green-50 to-emerald-50",
      description: "Organic vegetables & greens",
    },
    {
      id: "bakery",
      name: "Bakery",
      icon: <Coffee className="w-6 h-6" />,
      color: "text-amber-500",
      gradient: "from-amber-50 to-orange-50",
      description: "Fresh breads and baked goods",
    },
    {
      id: "dairy",
      name: "Dairy",
      icon: <ShoppingBag className="w-6 h-6" />,
      color: "text-blue-500",
      gradient: "from-blue-50 to-cyan-50",
      description: "Milk, yogurt, and dairy products",
    },
    {
      id: "fastfood",
      name: "Fast Food",
      icon: <Pizza className="w-6 h-6" />,
      color: "text-orange-500",
      gradient: "from-orange-50 to-yellow-50",
      description: "Quick bites and ready-to-eat meals",
    },
    {
      id: "desserts",
      name: "Desserts",
      icon: <IceCream className="w-6 h-6" />,
      color: "text-pink-500",
      gradient: "from-pink-50 to-rose-50",
      description: "Sweets and confectioneries",
    },
    {
      id: "restaurant",
      name: "Restaurant",
      icon: <Utensils className="w-6 h-6" />,
      color: "text-purple-500",
      gradient: "from-purple-50 to-violet-50",
      description: "Ready-made restaurant meals",
    },
    {
      id: "beverages",
      name: "Beverages",
      icon: <Wine className="w-6 h-6" />,
      color: "text-indigo-500",
      gradient: "from-indigo-50 to-blue-50",
      description: "Drinks and beverages",
    },
  ];

  // Mapping of categories to shop types
  const categoryToShopTypes: Record<string, string[]> = {
    fruits: ["Supermarket"],
    vegetables: ["Supermarket", "Vegetables"],
    bakery: ["Bakery"],
    dairy: ["Supermarket"],
    fastfood: ["Hotel"],
    desserts: ["Bakery", "Hotel"],
    restaurant: ["Hotel"],
    beverages: ["Supermarket", "Hotel"],
  };

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

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((cat) => cat !== id) : [...prev, id]
    );
  };

  // Filter shops based on selected categories
  const filteredShops = selectedCategories.length === 0
    ? shops
    : shops.filter((shop) =>
        selectedCategories.some((catId) =>
          categoryToShopTypes[catId]?.includes(shop.type)
        )
      );

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header */}
      <header className="bg-white p-4 sticky top-0 z-10 shadow-sm flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => router.back()}>
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-gray-800">Shop by Category</h1>
          <p className="text-xs text-gray-500">Pick categories to filter shops</p>
        </div>
      </header>

      {/* Categories Grid */}
      <section className="p-4 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-800">Select Categories</h2>
          {selectedCategories.length > 0 && (
            <motion.button
              onClick={() => setSelectedCategories([])}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1.5 bg-red-100 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-200 transition-colors"
            >
              Clear Filters
            </motion.button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category, idx) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => toggleCategory(category.id)}
              whileTap={{ scale: 0.95 }}
              className={`relative rounded-2xl p-4 text-center transition-all duration-300 border-2 ${
                selectedCategories.includes(category.id)
                  ? `bg-gradient-to-br ${category.gradient} border-transparent shadow-lg scale-105`
                  : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-md"
              }`}
            >
              <motion.div
                animate={{ scale: selectedCategories.includes(category.id) ? 1.2 : 1 }}
                className={`flex justify-center mb-2 ${category.color}`}
              >
                {category.icon}
              </motion.div>
              <h3 className="font-bold text-sm text-gray-800">{category.name}</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{category.description}</p>
              
              {/* Checkmark */}
              {selectedCategories.includes(category.id) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
                >
                  ✓
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Filtered Shops Section */}
      <section className="px-4 py-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            {selectedCategories.length === 0
              ? `All Shops (${shops.length})`
              : `Shops with ${selectedCategories.map(id => categories.find(c => c.id === id)?.name).join(", ")} (${filteredShops.length})`}
          </h3>

          {loading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredShops.length === 0 ? (
            <div className="text-center py-10">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">No shops found for selected categories</p>
              <p className="text-gray-300 text-sm mt-1">Try selecting different categories</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredShops.map((shop) => (
                <Link href={`/shop/${shop.id}`} key={shop.id} className="block group">
                  <motion.div
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 group-hover:border-red-200"
                  >
                    <div className="flex gap-4 p-4">
                      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={shop.image}
                          alt={shop.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm mb-1">{shop.name}</h4>
                          <p className="text-xs text-gray-500 mb-2">{shop.type} • {shop.address}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                              <Star className="w-3 h-3 fill-green-700" />
                              {shop.rating}
                            </div>
                            <span className="text-xs text-gray-500">{shop.time}</span>
                            <span className="text-xs text-gray-500">{shop.distance} km</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-lg z-40">
        <div className="max-w-[480px] mx-auto px-2 py-2">
          <div className="flex items-center justify-around">
            <Link href="/" className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-red-600 transition-colors">
              <ShoppingBag className="w-6 h-6" />
              <span className="text-[10px] font-medium">Home</span>
            </Link>
            <Link href="/categories" className="flex flex-col items-center gap-1 p-2 text-red-600">
              <Grid className="w-6 h-6" />
              <span className="text-[10px] font-semibold">Categories</span>
            </Link>
            <Link href="/" className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-green-600 transition-colors">
              <Leaf className="w-6 h-6" />
              <span className="text-[10px] font-medium">Veggies</span>
            </Link>
            <Link href="/" className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-orange-600 transition-colors">
              <Utensils className="w-6 h-6" />
              <span className="text-[10px] font-medium">Food</span>
            </Link>
            <Link href="/profile" className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-purple-600 transition-colors">
              <ShoppingBag className="w-6 h-6" />
              <span className="text-[10px] font-medium">Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
