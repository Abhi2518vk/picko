export type Shop = {
  id: string;
  name: string;
  type: string;
  image: string;
  rating: number;
  time: string;
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
    offers: "Buy 1 Get 1 Free",
  },
  {
    id: "3",
    name: "Green Grocers",
    type: "Vegetables",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop",
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
    type: "Hotel",
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
    type: "Hotel",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2670&auto=format&fit=crop",
    rating: 4.1,
    time: "30 mins",
    distance: 2.1,
    address: "Indiranagar 12th Main",
    lat: 12.9784,
    lng: 77.6408,
  },
  {
    id: "6",
    name: "Daily Fresh Supermarket",
    type: "Supermarket",
    image: "https://images.unsplash.com/photo-1604719312566-b7cb33636956?q=80&w=2670&auto=format&fit=crop",
    rating: 4.3,
    time: "12 mins",
    distance: 1.0,
    address: "MG Road, Bangalore",
    lat: 12.9750,
    lng: 77.6000,
    offers: "20% OFF",
  },
  {
    id: "7",
    name: "Sweet Delights Bakery",
    type: "Bakery",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2670&auto=format&fit=crop",
    rating: 4.7,
    time: "18 mins",
    distance: 1.8,
    address: "Koramangala 5th Block",
    lat: 12.9352,
    lng: 77.6245,
    offers: "Free Delivery",
  },
  {
    id: "8",
    name: "Organic Veggies",
    type: "Vegetables",
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2670&auto=format&fit=crop",
    rating: 4.6,
    time: "8 mins",
    distance: 0.5,
    address: "Jayanagar 4th Block",
    lat: 12.9250,
    lng: 77.5838,
    offers: "Fresh Daily",
  },
  {
    id: "9",
    name: "Grand Palace Hotel",
    type: "Hotel",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2670&auto=format&fit=crop",
    rating: 4.5,
    time: "35 mins",
    distance: 2.5,
    address: "Brigade Road",
    lat: 12.9719,
    lng: 77.6050,
    offers: "15% OFF",
  },
  {
    id: "10",
    name: "Quick Bites",
    type: "Hotel",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2670&auto=format&fit=crop",
    rating: 4.0,
    time: "20 mins",
    distance: 1.3,
    address: "Residency Road",
    lat: 12.9750,
    lng: 77.6100,
  },
  {
    id: "11",
    name: "Super Save Mart",
    type: "Supermarket",
    image: "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?q=80&w=2670&auto=format&fit=crop",
    rating: 4.4,
    time: "15 mins",
    distance: 1.6,
    address: "Whitefield Main Road",
    lat: 12.9698,
    lng: 77.7499,
    offers: "30% OFF",
  },
  {
    id: "12",
    name: "City Fresh Market",
    type: "Vegetables",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop",
    rating: 4.3,
    time: "10 mins",
    distance: 0.9,
    address: "HSR Layout Sector 1",
    lat: 12.9081,
    lng: 77.6476,
    offers: "Free Veggie Box",
  },
];

export const MOCK_PRODUCTS: Product[] = [
  // Shop 1 Products (Fresh Mart Supermarket)
  { id: "101", name: "Fresh Apples", price: 120, category: "Fruits", shopId: "1", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6" as string, description: "1kg Fresh Kashmir Apples" },
  { id: "102", name: "Whole Wheat Bread", price: 45, category: "Bakery", shopId: "1", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff" as string, description: "Freshly baked bread" },
  { id: "103", name: "Organic Milk", price: 30, category: "Dairy", shopId: "1", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b" as string, description: "500ml packet" },
  { id: "104", name: "Banana Bunch", price: 50, category: "Fruits", shopId: "1", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b" as string, description: "Fresh yellow bananas" },
  { id: "105", name: "Cheddar Cheese", price: 280, category: "Dairy", shopId: "1", image: "https://images.unsplash.com/photo-1452801956613-c451e4e3d1e2" as string, description: "200g block" },
  { id: "106", name: "Greek Yogurt", price: 60, category: "Dairy", shopId: "1", image: "https://images.unsplash.com/photo-1488477181946-6428a0291840" as string, description: "500ml container" },
  { id: "107", name: "Brown Rice", price: 180, category: "Grains", shopId: "1", image: "https://images.unsplash.com/photo-1586857999230-830ffe2b187d" as string, description: "1kg organic" },
  { id: "108", name: "Pasta Box", price: 90, category: "Packed Food", shopId: "1", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9" as string, description: "500g premium pasta" },
  { id: "109", name: "Tomato Sauce", price: 120, category: "Packed Food", shopId: "1", image: "https://images.unsplash.com/photo-1589985643862-8e13b0aa8e72" as string, description: "500ml bottle" },
  { id: "110", name: "Peanut Butter", price: 250, category: "Packed Food", shopId: "1", image: "https://images.unsplash.com/photo-1599599810694-b5ac4dd93c97" as string, description: "500g jar creamy" },
  { id: "111", name: "Honey", price: 350, category: "Packed Food", shopId: "1", image: "https://images.unsplash.com/photo-1587049905308-26ef684d712d" as string, description: "500g pure honey" },
  { id: "112", name: "Olive Oil", price: 520, category: "Oil", shopId: "1", image: "https://images.unsplash.com/photo-1474921583554-2f4e9ecb17e5" as string, description: "750ml extra virgin" },
  { id: "113", name: "Almond Butter", price: 380, category: "Packed Food", shopId: "1", image: "https://images.unsplash.com/photo-1419963981670-4119f98fc564" as string, description: "500g toasted" },
  { id: "114", name: "Green Juice", price: 140, category: "Beverages", shopId: "1", image: "https://images.unsplash.com/photo-1553530666-ba2a8e36cd12" as string, description: "1L cold pressed" },
  { id: "115", name: "Granola Cereal", price: 240, category: "Breakfast", shopId: "1", image: "https://images.unsplash.com/photo-1590080876078-6e1577c31b21" as string, description: "500g mixed berries" },
  { id: "116", name: "Orange Juice", price: 80, category: "Beverages", shopId: "1", image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba" as string, description: "1L fresh squeezed" },
  { id: "117", name: "Potato Chips", price: 40, category: "Snacks", shopId: "1", image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b" as string, description: "Pack of 100g" },
  { id: "118", name: "Chocolate Bar", price: 50, category: "Snacks", shopId: "1", image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b" as string, description: "Milk chocolate 100g" },

  // Shop 2 Products (Oven Fresh Bakery)
  { id: "201", name: "Chocolate Cake", price: 450, category: "Cakes", shopId: "2", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587" as string, description: "500g Dutch Truffle" },
  { id: "202", name: "Croissant", price: 80, category: "Pastries", shopId: "2", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a" as string, description: "Butter Croissant" },
  { id: "203", name: "Blueberry Muffin", price: 90, category: "Muffins", shopId: "2", image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa" as string, description: "Fresh baked muffin" },
  { id: "204", name: "Donut Box", price: 200, category: "Donuts", shopId: "2", image: "https://images.unsplash.com/photo-1551024601-562963525c5c" as string, description: "Box of 6 assorted" },
  { id: "205", name: "Baguette", price: 60, category: "Bread", shopId: "2", image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04" as string, description: "French baguette" },
  { id: "206", name: "Cinnamon Roll", price: 100, category: "Pastries", shopId: "2", image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812" as string, description: "Warm cinnamon roll" },
  { id: "207", name: "Cheese Danish", price: 120, category: "Pastries", shopId: "2", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff" as string, description: "Creamy cheese filling" },
  { id: "208", name: "Cookie Pack", price: 150, category: "Cookies", shopId: "2", image: "https://images.unsplash.com/photo-1499636138143-bd630f5cf386" as string, description: "Assorted cookies 200g" },

  // Shop 3 Products (Green Grocers)
  { id: "301", name: "Fresh Broccoli", price: 60, category: "Vegetables", shopId: "3", image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc" as string, description: "1 pc (approx 500g)" },
  { id: "302", name: "Carrots", price: 40, category: "Vegetables", shopId: "3", image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37" as string, description: "1kg fresh carrots" },
  { id: "303", name: "Spinach Bunch", price: 30, category: "Vegetables", shopId: "3", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb" as string, description: "Fresh spinach leaves" },
  { id: "304", name: "Bell Peppers", price: 80, category: "Vegetables", shopId: "3", image: "https://images.unsplash.com/photo-1563565375-f3fdf5dbc240" as string, description: "Mixed colors 500g" },
  { id: "305", name: "Tomatoes", price: 35, category: "Vegetables", shopId: "3", image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea" as string, description: "1kg ripe tomatoes" },
  { id: "306", name: "Onions", price: 30, category: "Vegetables", shopId: "3", image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb" as string, description: "1kg red onions" },
  { id: "307", name: "Potatoes", price: 40, category: "Vegetables", shopId: "3", image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" as string, description: "1kg fresh potatoes" },
  { id: "308", name: "Cucumber", price: 25, category: "Vegetables", shopId: "3", image: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8" as string, description: "2 pcs fresh cucumber" },

  // Shop 4 Products (Empire Hotel)
  { id: "401", name: "Chicken Biryani", price: 280, category: "Main Course", shopId: "4", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8" as string, description: "Aromatic basmati rice with tender chicken" },
  { id: "402", name: "Ghee Rice & Kabab", price: 220, category: "Combos", shopId: "4", image: "https://images.unsplash.com/photo-1626074353765-517a681e40be" as string, description: "Classic combo" },
  { id: "403", name: "Butter Chicken", price: 320, category: "Main Course", shopId: "4", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398" as string, description: "Creamy tomato curry" },
  { id: "404", name: "Paneer Tikka", price: 250, category: "Starters", shopId: "4", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7" as string, description: "Grilled cottage cheese" },
  { id: "405", name: "Garlic Naan", price: 45, category: "Breads", shopId: "4", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e" as string, description: "Fresh tandoor bread" },
  { id: "406", name: "Mango Lassi", price: 80, category: "Beverages", shopId: "4", image: "https://images.unsplash.com/photo-1600329372056-2a0f6c84570d" as string, description: "Cool mango yogurt drink" },
  { id: "407", name: "Samosa (2pcs)", price: 60, category: "Starters", shopId: "4", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950" as string, description: "Crispy potato filled" },
  { id: "408", name: "Dal Makhani", price: 180, category: "Main Course", shopId: "4", image: "https://images.unsplash.com/photo-1585937421612-70e008356f67" as string, description: "Creamy black lentils" },

  // Shop 5 Products (Spicy Treat)
  { id: "501", name: "Masala Dosa", price: 80, category: "Breakfast", shopId: "5", image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc" as string, description: "Crispy dosa with potato filling" },
  { id: "502", name: "South Indian Thali", price: 150, category: "Combos", shopId: "5", image: "https://images.unsplash.com/photo-1626074353765-517a681e40be" as string, description: "Complete meal with rice, sambar, rasam" },
  { id: "503", name: "Idli Sambar", price: 60, category: "Breakfast", shopId: "5", image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db" as string, description: "3 steamed idlis with sambar" },
  { id: "504", name: "Vada", price: 40, category: "Snacks", shopId: "5", image: "https://images.unsplash.com/photo-1601050690117-9c43209ca7fa" as string, description: "Crispy lentil donut" },
  { id: "505", name: "Pongal", price: 70, category: "Breakfast", shopId: "5", image: "https://images.unsplash.com/photo-1630395802453-1c4e9f0d7e8e" as string, description: "Rice and lentil dish" },
  { id: "506", name: "Filter Coffee", price: 30, category: "Beverages", shopId: "5", image: "https://images.unsplash.com/photo-1596710629120-d9971de5b058" as string, description: "Traditional South Indian" },
  { id: "507", name: "Pani Puri (6pcs)", price: 50, category: "Snacks", shopId: "5", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950" as string, description: "Spicy water balls" },
  { id: "508", name: "Bonda", price: 35, category: "Snacks", shopId: "5", image: "https://images.unsplash.com/photo-1601050690117-9c43209ca7fa" as string, description: "Potato fritter" },

  // Shop 6 Products (Daily Fresh Supermarket)
  { id: "601", name: "Eggs (Dozen)", price: 72, category: "Dairy", shopId: "6", image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f" as string, description: "Fresh farm eggs" },
  { id: "602", name: "Butter", price: 55, category: "Dairy", shopId: "6", image: "https://images.unsplash.com/photo-1589136737588-69e7ad09b93c" as string, description: "200g salted butter" },
  { id: "603", name: "Ice Cream", price: 120, category: "Frozen", shopId: "6", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb" as string, description: "1L Vanilla" },
  { id: "604", name: "Frozen Pizza", price: 180, category: "Frozen", shopId: "6", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591" as string, description: "Cheese pizza 30cm" },
  { id: "605", name: "Noodles Pack", price: 30, category: "Packed Food", shopId: "6", image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841" as string, description: "Instant noodles" },
  { id: "606", name: "Biscuits Pack", price: 40, category: "Snacks", shopId: "6", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35" as string, description: "Cream biscuits 200g" },
  { id: "607", name: "Cold Drink", price: 40, category: "Beverages", shopId: "6", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97" as string, description: "500ml Cola" },
  { id: "608", name: "Rice (1kg)", price: 60, category: "Grains", shopId: "6", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c" as string, description: "Premium basmati" },

  // Shop 7 Products (Sweet Delights Bakery)
  { id: "701", name: "Red Velvet Cake", price: 550, category: "Cakes", shopId: "7", image: "https://images.unsplash.com/photo-1586788680434-30d32443d465" as string, description: "1kg celebration cake" },
  { id: "702", name: "Brownie", price: 100, category: "Cookies", shopId: "7", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476d" as string, description: "Fudgy chocolate brownie" },
  { id: "703", name: "Tiramisu", price: 200, category: "Desserts", shopId: "7", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9" as string, description: "Italian coffee dessert" },
  { id: "704", name: "Cheesecake", price: 400, category: "Cakes", shopId: "7", image: "https://images.unsplash.com/photo-1533134242116-79c5e60818e2" as string, description: "New York style" },
  { id: "705", name: "Pudding", price: 80, category: "Desserts", shopId: "7", image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc" as string, description: "Caramel pudding" },
  { id: "706", name: "Eclair", price: 120, category: "Pastries", shopId: "7", image: "https://images.unsplash.com/photo-1551024601-562963525c5c" as string, description: "Chocolate eclair" },
  { id: "707", name: "Fruit Tart", price: 150, category: "Tarts", shopId: "7", image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13" as string, description: "Fresh fruit tart" },
  { id: "708", name: "Macarons (6pcs)", price: 180, category: "Cookies", shopId: "7", image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43" as string, description: "Assorted flavors" },

  // Shop 8 Products (Organic Veggies)
  { id: "801", name: "Organic Tomatoes", price: 50, category: "Vegetables", shopId: "8", image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea" as string, description: "500g organic" },
  { id: "802", name: "Organic Spinach", price: 40, category: "Vegetables", shopId: "8", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb" as string, description: "Fresh organic bunch" },
  { id: "803", name: "Organic Carrots", price: 55, category: "Vegetables", shopId: "8", image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37" as string, description: "500g organic" },
  { id: "804", name: "Cauliflower", price: 45, category: "Vegetables", shopId: "8", image: "https://images.unsplash.com/photo-1588106222626-5af1159ce7d2" as string, description: "Fresh cauliflower" },
  { id: "805", name: "Brinjal", price: 35, category: "Vegetables", shopId: "8", image: "https://images.unsplash.com/photo-1567306226449-7ffad13dd960" as string, description: "Purple brinjal 500g" },
  { id: "806", name: "Capsicum", price: 60, category: "Vegetables", shopId: "8", image: "https://images.unsplash.com/photo-1563565375-f3fdf5dbc240" as string, description: "Green capsicum 3pcs" },
  { id: "807", name: "Coriander", price: 15, category: "Vegetables", shopId: "8", image: "https://images.unsplash.com/photo-1618347535849-1d1c8f8c0c0c" as string, description: "Fresh coriander bunch" },
  { id: "808", name: "Green Chilies", price: 20, category: "Vegetables", shopId: "8", image: "https://images.unsplash.com/photo-1588612502809-77a8174d2f84" as string, description: "Fresh green chilies" },

  // Shop 9 Products (Grand Palace Hotel)
  { id: "901", name: "Mutton Biryani", price: 380, category: "Main Course", shopId: "9", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8" as string, description: "Premium mutton biryani" },
  { id: "902", name: "Fish Curry", price: 350, category: "Main Course", shopId: "9", image: "https://images.unsplash.com/photo-1606491048164-e7d3c1b17d05" as string, description: "Coastal style fish curry" },
  { id: "903", name: "Prawn Masala", price: 420, category: "Main Course", shopId: "9", image: "https://images.unsplash.com/photo-1626804475297-411d863b5285" as string, description: "Spicy prawn curry" },
  { id: "904", name: "Chicken Tikka", price: 280, category: "Starters", shopId: "9", image: "https://images.unsplash.com/photo-1626202158925-5410b0d4c6d8" as string, description: "Tandoor chicken tikka" },
  { id: "905", name: "Paneer Butter Masala", price: 260, category: "Main Course", shopId: "9", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7" as string, description: "Rich paneer curry" },
  { id: "906", name: "Raita", price: 50, category: "Sides", shopId: "9", image: "https://images.unsplash.com/photo-1606491048164-e7d3c1b17d05" as string, description: "Cucumber raita" },
  { id: "907", name: "Salad Bowl", price: 80, category: "Starters", shopId: "9", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd" as string, description: "Fresh garden salad" },
  { id: "908", name: "Sweet Lassi", price: 70, category: "Beverages", shopId: "9", image: "https://images.unsplash.com/photo-1600329372056-2a0f6c84570d" as string, description: "Sweet yogurt drink" },

  // Shop 10 Products (Quick Bites)
  { id: "1001", name: "Veg Burger", price: 100, category: "Fast Food", shopId: "10", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd" as string, description: "Crispy veg burger" },
  { id: "1002", name: "Chicken Burger", price: 150, category: "Fast Food", shopId: "10", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd" as string, description: "Grilled chicken burger" },
  { id: "1003", name: "French Fries", price: 80, category: "Fast Food", shopId: "10", image: "https://images.unsplash.com/photo-1573080496987-a199f8cd75ec" as string, description: "Crispy fries" },
  { id: "1004", name: "Veg Pizza", price: 180, category: "Fast Food", shopId: "10", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591" as string, description: "Medium veg pizza" },
  { id: "1005", name: "Non-Veg Pizza", price: 220, category: "Fast Food", shopId: "10", image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3" as string, description: "Medium non-veg pizza" },
  { id: "1006", name: "Cold Coffee", price: 90, category: "Beverages", shopId: "10", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699" as string, description: "Iced coffee" },
  { id: "1007", name: "Veg Roll", price: 70, category: "Fast Food", shopId: "10", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f" as string, description: "Veg kathi roll" },
  { id: "1008", name: "Chicken Roll", price: 100, category: "Fast Food", shopId: "10", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f" as string, description: "Chicken kathi roll" },

  // Shop 11 Products (Super Save Mart)
  { id: "1101", name: "Sugar (1kg)", price: 45, category: "Grains", shopId: "11", image: "https://images.unsplash.com/photo-1581441363689-1f3c4a44cf88" as string, description: "Refined sugar" },
  { id: "1102", name: "Salt (1kg)", price: 20, category: "Grains", shopId: "11", image: "https://images.unsplash.com/photo-1518331647614-7a1f74cd90b1" as string, description: "Iodized salt" },
  { id: "1103", name: "Tea (500g)", price: 180, category: "Beverages", shopId: "11", image: "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2" as string, description: "Premium tea" },
  { id: "1104", name: "Coffee (250g)", price: 200, category: "Beverages", shopId: "11", image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e" as string, description: "Ground coffee" },
  { id: "1105", name: "Flour (1kg)", price: 50, category: "Grains", shopId: "11", image: "https://images.unsplash.com/photo-1586190848861-99c9574548e3" as string, description: "Whole wheat flour" },
  { id: "1106", name: "Cooking Oil (1L)", price: 140, category: "Oil", shopId: "11", image: "https://images.unsplash.com/photo-1474921583554-2f4e9ecb17e5" as string, description: "Sunflower oil" },
  { id: "1107", name: "Spices Pack", price: 100, category: "Packed Food", shopId: "11", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d" as string, description: "Mixed spices" },
  { id: "1108", name: "Biscuits (500g)", price: 80, category: "Snacks", shopId: "11", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35" as string, description: "Assorted biscuits" },

  // Shop 12 Products (City Fresh Market)
  { id: "1201", name: "Mint Leaves", price: 20, category: "Vegetables", shopId: "12", image: "https://images.unsplash.com/photo-1618347535849-1d1c8f8c0c0c" as string, description: "Fresh mint bunch" },
  { id: "1202", name: "Ginger", price: 30, category: "Vegetables", shopId: "12", image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5" as string, description: "Fresh ginger 100g" },
  { id: "1203", name: "Garlic", price: 40, category: "Vegetables", shopId: "12", image: "https://images.unsplash.com/photo-1615485500704-8e99099928b3" as string, description: "Fresh garlic 100g" },
  { id: "1204", name: "Curry Leaves", price: 15, category: "Vegetables", shopId: "12", image: "https://images.unsplash.com/photo-1618347535849-1d1c8f8c0c0c" as string, description: "Fresh curry leaves" },
  { id: "1205", name: "Lemon (6pcs)", price: 30, category: "Fruits", shopId: "12", image: "https://images.unsplash.com/photo-1590502593747-42a996133562" as string, description: "Fresh lemons" },
  { id: "1206", name: "Coconut", price: 35, category: "Vegetables", shopId: "12", image: "https://images.unsplash.com/photo-1550505193-98194a6b0c0c" as string, description: "Fresh coconut" },
  { id: "1207", name: "Drumstick (5pcs)", price: 40, category: "Vegetables", shopId: "12", image: "https://images.unsplash.com/photo-1604908176997-125f2fcc018e" as string, description: "Fresh drumsticks" },
  { id: "1208", name: "Okra (500g)", price: 35, category: "Vegetables", shopId: "12", image: "https://images.unsplash.com/photo-1601648764658-cf37e98b7553" as string, description: "Fresh okra" },
];