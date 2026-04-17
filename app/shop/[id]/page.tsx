"use client";

import { useParams, useRouter } from "next/navigation";
import { MOCK_SHOPS, MOCK_PRODUCTS, Shop, Product } from "@/lib/mockData";
import { useCart } from "../../providers";
import { ArrowLeft, Star, MapPin, Plus, Minus, ShoppingBag, Search, Filter } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { robustFetch } from "@/lib/apiClient";
import { ListSkeleton, Skeleton } from "@/app/components/ui/Skeleton";
import Image from "next/image";

export default function ShopDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [shop, setShop] = useState<Shop | undefined>(undefined);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const dataLoaded = useRef(false);
  const { addToCart, removeFromCart, updateQuantity, items, totalAmount, totalItems } = useCart();

  useEffect(() => {
    if (dataLoaded.current) return;
    dataLoaded.current = true;

    const loadData = async () => {
      try {
        setLoading(true);
        const [shopsData, productsData] = await Promise.all([
          robustFetch(MOCK_SHOPS),
          robustFetch(MOCK_PRODUCTS)
        ]);
        setShop(shopsData.find((s: Shop) => s.id === id));
        setProducts(productsData.filter((p: Product) => p.shopId === id));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const getQuantity = useCallback(
    (productId: string) => items.find((i) => i.id === productId)?.quantity || 0,
    [items]
  );

  const handleUpdateQuantity = (product: Product, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, newQuantity);
    }
  };

  const handleAddToCart = useCallback(
    (product: Product) => {
      if (getQuantity(product.id) === 0) {
        addToCart(product);
      }
    },
    [addToCart, getQuantity]
  );

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseProductModal = () => {
    setSelectedProduct(null);
  };

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];
  const filteredProducts =
    selectedCategory === "All" ? products : products.filter((p) => p.category === selectedCategory);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-[#fafafa] via-[#f8f8f8] to-[#f5f5f7] min-h-screen pb-24">
        <div className="h-16 bg-white shadow-sm mb-4 flex items-center px-4">
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
        <div className="px-4 space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xl h-48 flex flex-col gap-4">
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
            <div className="flex justify-center gap-4">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
          <ListSkeleton />
        </div>
      </div>
    );
  }

  if (!shop) {
    router.push("/");
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-[#fafafa] via-[#f8f8f8] to-[#f5f5f7] min-h-screen pb-24">
      <header className="sticky top-0 z-40 glass-strong shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex gap-3">
            <button className="p-2 rounded-full bg-gray-50 text-gray-700 hover:bg-gray-100">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="px-4">
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xl premium-shadow text-center -mt-2">
          <h1 className="text-2xl font-black text-gray-800">{shop.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{shop.type} • {shop.address}</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
              <Star className="w-3 h-3 fill-white" />
              {shop.rating}
            </div>
            <div className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{shop.time}</div>
            <div className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{shop.distance} km</div>
          </div>
          <div className="mt-5 border-t border-gray-100 pt-4">
            <Link
              href={`/map?shopId=${shop.id}`}
              className="flex items-center justify-center gap-2 text-primary font-bold text-sm bg-red-50 py-3 rounded-xl hover:bg-red-100 transition-colors"
            >
              <MapPin className="w-4 h-4" /> Get Directions
            </Link>
          </div>
        </div>
      </div>

      <div className="px-4 mt-6">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all shadow-sm ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 px-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Menu</h2>
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              className="product-card cursor-pointer group"
              onClick={() => handleProductClick(product)}
            >
              <div className="relative h-36 w-full overflow-hidden rounded-t-2xl">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                {getQuantity(product.id) > 0 && (
                  <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateQuantity(product, getQuantity(product.id) - 1);
                        }}
                        className="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-gray-100 transition-colors font-bold"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-gray-900">{getQuantity(product.id)}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateQuantity(product, getQuantity(product.id) + 1);
                        }}
                        className="w-8 h-8 flex items-center justify-center text-green-600 hover:bg-gray-100 transition-colors font-bold"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-bold text-gray-800 text-sm line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{product.category}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-gray-900">₹{product.price}</span>
                  {getQuantity(product.id) === 0 ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:shadow-lg transition-all"
                    >
                      Add
                    </button>
                  ) : (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateQuantity(product, getQuantity(product.id) - 1);
                        }}
                        className="w-7 h-7 flex items-center justify-center text-red-600 hover:bg-gray-100 transition-colors font-bold rounded-lg"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-gray-900 text-sm w-5 text-center">
                        {getQuantity(product.id)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateQuantity(product, getQuantity(product.id) + 1);
                        }}
                        className="w-7 h-7 flex items-center justify-center text-green-600 hover:bg-gray-100 transition-colors font-bold rounded-lg"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            onClick={handleCloseProductModal}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end justify-center p-0"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl h-[85vh] bg-white rounded-t-3xl overflow-hidden shadow-2xl"
            >
              <div className="relative h-60 w-full">
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
                <button
                  onClick={handleCloseProductModal}
                  className="absolute top-4 right-4 rounded-full bg-white/95 p-3 shadow-lg hover:bg-white transition"
                >
                  <Minus className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 pb-8 overflow-y-auto h-[calc(100%-15rem)]">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">{selectedProduct.name}</h2>
                    <p className="text-sm text-gray-500 mt-1">{selectedProduct.category} · {shop?.name}</p>
                  </div>
                  <span className="text-2xl font-black text-green-600">₹{selectedProduct.price}</span>
                </div>
                <p className="text-sm leading-6 text-gray-600 mb-5">{selectedProduct.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="rounded-full bg-green-50 text-green-700 px-3 py-1 text-xs font-semibold">{shop?.time}</span>
                  <span className="rounded-full bg-gray-100 text-gray-700 px-3 py-1 text-xs font-semibold">{shop?.distance} km</span>
                  <span className="rounded-full bg-gray-100 text-gray-700 px-3 py-1 text-xs font-semibold">{shop?.address}</span>
                </div>

                <div className="flex items-center justify-between gap-4 bg-gray-100 p-4 rounded-3xl">
                  {getQuantity(selectedProduct.id) > 0 ? (
                    <div className="flex items-center gap-4 rounded-full bg-white p-2 shadow-sm">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateQuantity(selectedProduct, getQuantity(selectedProduct.id) - 1);
                        }}
                        className="text-gray-700 rounded-full bg-gray-50 p-3 hover:bg-gray-100 transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-gray-900 text-lg">{getQuantity(selectedProduct.id)}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateQuantity(selectedProduct, getQuantity(selectedProduct.id) + 1);
                        }}
                        className="text-gray-700 rounded-full bg-gray-50 p-3 hover:bg-gray-100 transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div />
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (getQuantity(selectedProduct.id) === 0) {
                        handleAddToCart(selectedProduct);
                      }
                    }}
                    disabled={getQuantity(selectedProduct.id) > 0}
                    className={`flex-1 px-6 py-3 rounded-3xl font-bold shadow-lg transition ${
                      getQuantity(selectedProduct.id) > 0
                        ? "bg-gray-200 text-gray-500 cursor-default"
                        : "bg-gradient-to-r from-green-600 to-emerald-700 text-white hover:shadow-xl"
                    }`}
                  >
                    {getQuantity(selectedProduct.id) > 0 ? "Added ✓" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {totalItems > 0 && (
        <div className="fixed bottom-20 w-full flex justify-center z-40">
          <Link href="/cart">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-gradient-to-r from-green-600 to-emerald-700 text-white w-[90%] max-w-[400px] rounded-xl flex items-center justify-between px-4 py-3 shadow-2xl"
            >
              <div className="flex flex-col">
                <span className="text-xs font-medium uppercase opacity-90">{totalItems} ITEMS</span>
                <span className="font-bold text-lg">₹{totalAmount}</span>
              </div>
              <div className="flex items-center gap-1 font-bold">
                View Cart
                <ShoppingBag className="w-4 h-4" />
              </div>
            </motion.div>
          </Link>
        </div>
      )}
    </div>
  );
}
