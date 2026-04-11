"use client";

import { useParams, useRouter } from "next/navigation";
import { MOCK_SHOPS, MOCK_PRODUCTS, Shop, Product } from "@/lib/mockData";
import { useCart } from "../../providers";
import { ArrowLeft, Star, MapPin, Plus, Minus, ShoppingBag, Search } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { robustFetch } from "@/lib/apiClient";
import { ListSkeleton, Skeleton } from "@/app/components/ui/Skeleton";

export default function ShopDetail() {
    const { id } = useParams();
    const router = useRouter();
    const [shop, setShop] = useState<Shop | undefined>(undefined);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const { addToCart, removeFromCart, updateQuantity, items, totalAmount, totalItems } = useCart();

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [shopsData, productsData] = await Promise.all([
                    robustFetch(MOCK_SHOPS),
                    robustFetch(MOCK_PRODUCTS)
                ]);
                setShop(shopsData.find(s => s.id === id));
                setProducts(productsData.filter(p => p.shopId === id));
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    // Track quantities visually
    const getQuantity = (productId: string) => items.find(i => i.id === productId)?.quantity || 0;

    const handleAddToCart = (product: Product) => {
        addToCart(product);
    };

    const handleProductSelect = (product: Product) => {
        setSelectedProduct(product);
    };

    const handleCloseProduct = () => {
        setSelectedProduct(null);
    };

    if (loading) {
        return (
            <div className="bg-white min-h-screen pb-24">
                {/* Skeleton Header */}
                <div className="h-16 bg-white shadow-sm mb-4 flex items-center px-4">
                    <Skeleton className="w-8 h-8 rounded-full" />
                </div>

                <div className="px-4 space-y-6">
                    {/* Shop Info Skeleton */}
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xl h-48 flex flex-col gap-4">
                        <Skeleton className="h-8 w-3/4 mx-auto" />
                        <Skeleton className="h-4 w-1/2 mx-auto" />
                        <div className="flex justify-center gap-4">
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                    </div>

                    {/* Products Skeleton */}
                    <ListSkeleton />
                </div>
            </div>
        );
    }

    if (!shop) return <div className="p-10 text-center">Shop not found</div>;

    return (
        <div className="bg-white min-h-screen pb-24">
            {/* Sticky Header */}
            <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md shadow-sm">
                <div className="flex items-center justify-between p-4">
                    <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <div className="flex gap-3">
                        <button className="p-2 rounded-full bg-gray-50 text-gray-700 hover:bg-gray-100">
                            <SearchIcon />
                        </button>
                    </div>
                </div>
            </header>

            {/* Shop Info Card */}
            <div className="px-4">
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xl premium-shadow text-center -mt-2">
                    <h1 className="text-2xl font-black text-gray-800">{shop.name}</h1>
                    <p className="text-sm text-gray-500 mt-1">{shop.type} • {shop.address}</p>

                    <div className="flex items-center justify-center gap-4 mt-4">
                        <div className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                            <Star className="w-3 h-3 fill-white" /> {shop.rating}
                        </div>
                        <div className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{shop.time}</div>
                        <div className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{shop.distance} km</div>
                    </div>

                    <div className="mt-5 border-t border-gray-100 pt-4">
                        <Link href={`/map?shopId=${shop.id}`} className="flex items-center justify-center gap-2 text-primary font-bold text-sm bg-red-50 py-3 rounded-xl hover:bg-red-100 transition-colors">
                            <MapPin className="w-4 h-4" /> Get Directions
                        </Link>
                    </div>
                </div>
            </div>

            {/* Menu / Products */}
            <div className="mt-8 px-4">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Recommended</h2>


                <div className="space-y-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="flex gap-3 items-start border-b border-gray-50 pb-6 last:border-0 cursor-pointer hover:bg-gray-50/50 p-3 -mx-3 rounded-lg transition-colors"
                            onClick={() => handleProductSelect(product)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleProductSelect(product);
                                }
                            }}
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start gap-2">
                                    <div className="w-3 h-3 border border-green-600 flex items-center justify-center mt-1 flex-shrink-0">
                                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-800 text-base break-words">{product.name}</h3>
                                        <p className="font-medium text-gray-700 mt-1">₹{product.price}</p>
                                        <p className="text-xs text-gray-400 mt-2 line-clamp-2">{product.description}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative w-32 h-28 flex-shrink-0">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl cursor-pointer" onClick={(e) => { e.stopPropagation(); handleProductSelect(product); }} />

                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-lg border border-gray-200 w-24 flex items-center justify-between text-green-600 font-bold overflow-hidden h-9">
                                    {getQuantity(product.id) === 0 ? (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart(product);
                                            }}
                                            className="w-full h-full text-sm uppercase hover:bg-green-50 transition-colors font-semibold"
                                        >
                                            Add
                                        </button>
                                    ) : (
                                        <>
                                            <button onClick={(e) => { e.stopPropagation(); removeFromCart(product.id); }} className="w-8 h-full flex items-center justify-center hover:bg-gray-100"><Minus className="w-3 h-3" /></button>
                                            <span className="text-sm">{getQuantity(product.id)}</span>
                                            <button onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }} className="w-8 h-full flex items-center justify-center hover:bg-gray-100"><Plus className="w-3 h-3" /></button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Product Detail Overlay */}
            {selectedProduct && (
                <div onClick={handleCloseProduct} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end justify-center p-0">
                    <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl h-[85vh] bg-white rounded-t-3xl overflow-hidden shadow-2xl">
                        <div className="relative h-60 w-full">
                            <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                            <button
                                onClick={handleCloseProduct}
                                className="absolute top-4 right-4 rounded-full bg-white/95 p-3 shadow hover:bg-white transition"
                            >
                                Close
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

                            <div className="space-y-4">
                                <div className="flex items-center justify-between gap-4 bg-gray-100 p-4 rounded-3xl">
                                    <div className="flex items-center gap-4 rounded-full bg-white p-2 shadow-sm">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const quantity = getQuantity(selectedProduct.id);
                                                if (quantity > 1) {
                                                    updateQuantity(selectedProduct.id, quantity - 1);
                                                } else {
                                                    removeFromCart(selectedProduct.id);
                                                }
                                            }}
                                            className="text-gray-700 rounded-full bg-gray-50 p-3 hover:bg-gray-100 transition"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="font-bold text-gray-900 text-lg">{getQuantity(selectedProduct.id)}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart(selectedProduct);
                                            }}
                                            className="text-gray-700 rounded-full bg-gray-50 p-3 hover:bg-gray-100 transition"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddToCart(selectedProduct);
                                        }}
                                        className="flex-1 bg-green-600 text-white px-6 py-3 rounded-3xl font-bold shadow-lg hover:bg-green-700 transition"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Cart Button */}
            {totalItems > 0 && (
                <div className="fixed bottom-20 w-full flex justify-center z-40">
                    <Link href="/cart">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-green-600 text-white w-[90%] max-w-[400px] rounded-xl flex items-center justify-between px-4 py-3 shadow-2xl"
                        >
                            <div className="flex flex-col">
                                <span className="text-xs font-medium uppercase opacity-90">{totalItems} ITEMS</span>
                                <span className="font-bold text-lg">₹{totalAmount}</span>
                            </div>
                            <div className="flex items-center gap-1 font-bold">
                                View Cart <ShoppingBag className="w-4 h-4" />
                            </div>
                        </motion.div>
                    </Link>
                </div>
            )}
        </div>
    );
}

function SearchIcon() {
    return <Search className="w-5 h-5" />;
}
