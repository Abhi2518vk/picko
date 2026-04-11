export type Shop = {
    id: string;
    name: string;
    type: string;
    image: string;
    rating: number;
    time: string; // Time to pickup
    distance: number;
    address: string;
    lat: number;
    lng: number;
    offers?: string;
};

export type Product = {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    category: string;
    shopId: string;
};

export const MOCK_SHOPS: Shop[] = [
    {
        id: "1",
        name: "Fresh Mart Supermarket",
        type: "Supermarket",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop",
        rating: 4.5,
        time: "10 mins",
        distance: 0.8,
        address: "123 Main St, Tech City",
        lat: 12.9716,
        lng: 77.5946,
        offers: "50% OFF",
    },
    {
        id: "2",
        name: "Oven Fresh Bakery",
        type: "Bakery",
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=2626&auto=format&fit=crop",
        rating: 4.8,
        time: "15 mins",
        distance: 1.2,
        address: "45 Bakery Lane, Food Court",
        lat: 12.9780,
        lng: 77.6000,
    },
    {
        id: "3",
        name: "Green Grocers",
        type: "Vegetables",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop", // Placeholder
        rating: 4.2,
        time: "5 mins",
        distance: 0.3,
        address: "Near Park Avenue",
        lat: 12.9690,
        lng: 77.5900,
        offers: "Buy 1 Get 1",
    },
    {
        id: "4",
        name: "Empire Hotel",
        type: "Hotel", // New Category
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2670&auto=format&fit=crop",
        rating: 4.4,
        time: "25 mins",
        distance: 1.5,
        address: "Church Street",
        lat: 12.9750,
        lng: 77.6050,
        offers: "10% OFF",
    },
    {
        id: "5",
        name: "Spicy Treat",
        type: "Hotel", // New Category
        image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2670&auto=format&fit=crop",
        rating: 4.1,
        time: "30 mins",
        distance: 2.1,
        address: "Indiranagar 12th Main",
        lat: 12.9784,
        lng: 77.6408,
    },
];

export const MOCK_PRODUCTS: Product[] = [
    // Shop 1 Products (Fresh Mart Supermarket - Multiple items)
    { id: "101", name: "Fresh Apples", price: 120, category: "Fruits", shopId: "1", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6" as string, description: "1kg Fresh Kashmir Apples" },
    { id: "102", name: "Whole Wheat Bread", price: 45, category: "Bakery", shopId: "1", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff" as string, description: "Freshly baked bread" },
    { id: "103", name: "Organic Milk", price: 30, category: "Dairy", shopId: "1", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b" as string, description: "500ml packet" },
    { id: "104", name: "Banana Bunch", price: 50, category: "Fruits", shopId: "1", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b" as string, description: "Fresh yellow bananas" },
    { id: "105", name: "Cheddar Cheese", price: 280, category: "Dairy", shopId: "1", image: "https://images.unsplash.com/photo-1452801956613-c451e4e3d1e2" as string, description: "200g block" },
    { id: "106", name: "Greek Yogurt", price: 60, category: "Dairy", shopId: "1", image: "https://images.unsplash.com/photo-1488477181946-6428a0291840" as string, description: "500ml container" },
    { id: "107", name: "Brown Rice", price: 180, category: "Grains", shopId: "1", image: "https://images.unsplash.com/photo-1586857999230-830ffe2b187d" as string, description: "1kg organic" },
    { id: "108", name: "Pasta Box", price: 90, category: "Grains", shopId: "1", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9" as string, description: "500g premium pasta" },
    { id: "109", name: "Tomato Sauce", price: 120, category: "Sauces", shopId: "1", image: "https://images.unsplash.com/photo-1589985643862-8e13b0aa8e72" as string, description: "500ml bottle" },
    { id: "110", name: "Peanut Butter", price: 250, category: "Spreads", shopId: "1", image: "https://images.unsplash.com/photo-1599599810694-b5ac4dd93c97" as string, description: "500g jar creamy" },
    { id: "111", name: "Honey", price: 350, category: "Condiments", shopId: "1", image: "https://images.unsplash.com/photo-1587049905308-26ef684d712d" as string, description: "500g pure honey" },
    { id: "112", name: "Olive Oil", price: 520, category: "Oil", shopId: "1", image: "https://images.unsplash.com/photo-1474921583554-2f4e9ecb17e5" as string, description: "750ml extra virgin" },
    { id: "113", name: "Almond Butter", price: 380, category: "Spreads", shopId: "1", image: "https://images.unsplash.com/photo-1419963981670-4119f98fc564" as string, description: "500g toasted" },
    { id: "114", name: "Green Juice", price: 140, category: "Beverages", shopId: "1", image: "https://images.unsplash.com/photo-1553530666-ba2a8e36cd12" as string, description: "1L cold pressed" },
    { id: "115", name: "Granola Cereal", price: 240, category: "Breakfast", shopId: "1", image: "https://images.unsplash.com/photo-1590080876078-6e1577c31b21" as string, description: "500g mixed berries" },

    // Shop 2 Products
    { id: "201", name: "Chocolate Cake", price: 450, category: "Cakes", shopId: "2", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587" as string, description: "500g Dutch Truffle" },
    { id: "202", name: "Croissant", price: 80, category: "Pastry", shopId: "2", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a" as string, description: "Butter Croissant" },

    // Shop 3 Products (Green Grocers)
    { id: "301", name: "Fresh Broccoli", price: 60, category: "Vegetables", shopId: "3", image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc" as string, description: "1 pc (approx 500g)" },

    // Shop 4 Products (Empire Hotel)
    { id: "401", name: "Chicken Biryani", price: 280, category: "Main Course", shopId: "4", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8" as string, description: "Aromatic basmati rice with tender chicken" },
    { id: "402", name: "Ghee Rice & Kabab", price: 220, category: "Combos", shopId: "4", image: "https://images.unsplash.com/photo-1626074353765-517a681e40be" as string, description: "Classic combo" },

    // Shop 5 Products (Spicy Treat)
    { id: "501", name: "Masala Dosa", price: 80, category: "Breakfast", shopId: "5", image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc" as string, description: "Crispy dosa with potato filling" },
    { id: "502", name: "South Indian Thali", price: 150, category: "Lunch", shopId: "5", image: "https://images.unsplash.com/photo-1626074353765-517a681e40be" as string, description: "Complete meal with rice, sambar, rasam" },
];
