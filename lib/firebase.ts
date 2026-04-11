import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
  Auth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  PhoneAuthProvider,
  signInWithCredential
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  Firestore
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, FirebaseStorage } from "firebase/storage";

// Firebase configuration with fallback
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "dummy-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "dummy.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "dummy-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "dummy.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789012:web:abcdef1234567890",
};

// Initialize Firebase only if config is valid
let app: any;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let googleProvider: GoogleAuthProvider;
let firebaseInitialized = false;

try {
  // Check if we have a real Firebase config (not all dummy values)
  const hasRealConfig = 
    firebaseConfig.apiKey && 
    firebaseConfig.apiKey !== "dummy-key" &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId !== "dummy-project";

  if (hasRealConfig) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    googleProvider = new GoogleAuthProvider();
    firebaseInitialized = true;
    console.log("✅ Firebase initialized successfully with project:", firebaseConfig.projectId);
  } else {
    console.warn("⚠️ Firebase not initialized - using dummy config. Please update .env.local with real Firebase credentials.");
  }
} catch (error) {
  console.warn("⚠️ Firebase initialization failed:", error);
}

// Collections
export const COLLECTIONS = {
  USERS: "users",
  PRODUCTS: "products",
  ORDERS: "orders",
  CARTS: "carts",
} as const;

// User types
export interface FirebaseUserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: any;
  updatedAt: any;
  phoneNumber?: string;
  gender?: "male" | "female" | "other";
}

// Product types
export interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  createdAt: any;
  updatedAt: any;
}

// Safe Firebase functions with fallbacks
export async function loginWithEmail(email: string, password: string) {
  if (!firebaseInitialized) {
    throw new Error("Firebase not initialized");
  }
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function signupWithEmail(email: string, password: string, displayName: string) {
  if (!firebaseInitialized) {
    throw new Error("Firebase not initialized");
  }
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user document in Firestore
    await setDoc(doc(db, COLLECTIONS.USERS, userCredential.user.uid), {
      uid: userCredential.user.uid,
      email,
      displayName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return userCredential.user;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
}

export async function loginWithGoogle() {
  if (!firebaseInitialized) {
    throw new Error("Firebase not initialized");
  }
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Check if user document exists
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, result.user.uid));
    
    if (!userDoc.exists()) {
      // Create user document
      await setDoc(doc(db, COLLECTIONS.USERS, result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    
    return result.user;
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
}

export async function logout() {
  if (!firebaseInitialized) {
    return; // Nothing to logout from
  }
  
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

// User management
export async function getUserData(uid: string): Promise<FirebaseUserData | null> {
  if (!firebaseInitialized) {
    return null; // Fallback to localStorage
  }
  
  try {
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, uid));
    return userDoc.exists() ? (userDoc.data() as FirebaseUserData) : null;
  } catch (error) {
    console.error("Get user data error:", error);
    return null;
  }
}

export async function updateUserData(uid: string, data: Partial<FirebaseUserData>) {
  if (!firebaseInitialized) {
    return; // Skip Firebase update
  }
  
  try {
    await updateDoc(doc(db, COLLECTIONS.USERS, uid), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Update user data error:", error);
    throw error;
  }
}

// Product management
export async function getProducts(category?: string): Promise<ProductData[]> {
  if (!firebaseInitialized) {
    return []; // Fallback to mock data
  }
  
  try {
    let productsQuery = query(collection(db, COLLECTIONS.PRODUCTS));
    
    if (category) {
      productsQuery = query(collection(db, COLLECTIONS.PRODUCTS), where("category", "==", category));
    }
    
    const snapshot = await getDocs(productsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ProductData[];
  } catch (error) {
    console.error("Get products error:", error);
    return [];
  }
}

export async function getProductById(id: string): Promise<ProductData | null> {
  if (!firebaseInitialized) {
    return null; // Fallback to mock data
  }
  
  try {
    const productDoc = await getDoc(doc(db, COLLECTIONS.PRODUCTS, id));
    return productDoc.exists() ? { id: productDoc.id, ...productDoc.data() } as ProductData : null;
  } catch (error) {
    console.error("Get product error:", error);
    return null;
  }
}

// Cart management
export async function getUserCart(uid: string) {
  if (!firebaseInitialized) {
    return { items: [] }; // Fallback to localStorage
  }
  
  try {
    const cartDoc = await getDoc(doc(db, COLLECTIONS.CARTS, uid));
    return cartDoc.exists() ? cartDoc.data() : { items: [] };
  } catch (error) {
    console.error("Get user cart error:", error);
    return { items: [] };
  }
}

export async function updateUserCart(uid: string, items: any[]) {
  if (!firebaseInitialized) {
    return; // Skip Firebase update
  }
  
  try {
    await setDoc(doc(db, COLLECTIONS.CARTS, uid), {
      items,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Update user cart error:", error);
    throw error;
  }
}

// Order management
export async function createOrder(orderData: any) {
  if (!firebaseInitialized) {
    return "mock-order-id"; // Return mock ID
  }
  
  try {
    const orderRef = await addDoc(collection(db, COLLECTIONS.ORDERS), {
      ...orderData,
      createdAt: serverTimestamp(),
      status: "pending",
    });
    return orderRef.id;
  } catch (error) {
    console.error("Create order error:", error);
    throw error;
  }
}

// File upload
export async function uploadFile(file: File, path: string): Promise<string> {
  if (!firebaseInitialized) {
    return "https://via.placeholder.com/300"; // Return placeholder
  }
  
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Upload file error:", error);
    throw error;
  }
}

// Auth state listener helper
export function onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
  if (!firebaseInitialized) {
    // Call immediately with null for fallback
    setTimeout(() => callback(null), 100);
    return () => {}; // Return empty unsubscribe function
  }
  
  return onAuthStateChanged(auth, callback);
}

// Phone Authentication
let confirmationResult: ConfirmationResult | null = null;

export async function signInWithPhoneNumberFirebase(phoneNumber: string): Promise<void> {
  // In development/demo mode, skip actual Firebase phone auth
  // if Firebase is not initialized or billing is not enabled.
  if (!firebaseInitialized || !auth || process.env.NEXT_PUBLIC_FIREBASE_DEMO_MODE === "true") {
    console.log("📞 Using phone auth demo mode. No SMS will be sent.");
    confirmationResult = null; // Ensure no actual confirmation result is set
    return; // Exit without attempting Firebase phone auth
  }

  try {
    const container = document.getElementById("recaptcha-container");
    if (!container) {
      throw new Error("reCAPTCHA container not found");
    }

    const appVerifier = new RecaptchaVerifier(auth, container, {
      size: "invisible",
      callback: () => {
        console.log("reCAPTCHA solved");
      }
    });

    confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    console.log("OTP sent successfully");
  } catch (error: any) {
    console.error("Phone sign-in error:", error);

    if (error?.code === "auth/billing-not-enabled") {
      console.warn("Firebase phone auth requires Blaze billing to be enabled. Falling back to demo mode. Use Firebase phone auth test numbers for local development without billing.");
      // In this case, we still want to proceed to the OTP verification step in demo mode
      confirmationResult = null; 
      return; 
    }

    if (error?.code === "auth/invalid-phone-number" || error?.code === "auth/missing-phone-number") {
      throw new Error("Invalid phone number. Please use a valid phone number.");
    }

    throw error;
  }
}

export async function verifyOTP(otp: string): Promise<FirebaseUser> {
  // If in demo mode, or Firebase is not initialized, we simulate OTP verification
  if (!firebaseInitialized || !db || process.env.NEXT_PUBLIC_FIREBASE_DEMO_MODE === "true") {
    if (otp.length === 6) {
      console.log("✅ OTP verified successfully (demo mode).");
      return {
        uid: `phone_${Date.now()}`,
        email: `demo_user_${Date.now()}@example.com`,
        emailVerified: false,
        displayName: "Demo User",
        isAnonymous: false,
        metadata: {},
        providerData: [],
        phoneNumber: "",
        photoURL: null,
        reload: async () => {},
        getIdToken: async () => "",
        getIdTokenResult: async () => ({ token: "", claims: {} } as any),
        signOut: async () => {},
        delete: async () => {},
        toJSON: () => ({})
      } as any;
    } else {
      throw new Error("Invalid OTP in demo mode. Please enter any 6-digit code.");
    }
  }

  if (!confirmationResult) {
    throw new Error("OTP verification not initiated. Please send OTP first.");
  }

  try {
    const userCredential = await confirmationResult.confirm(otp);
    
    // Create or update user document in Firestore
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userCredential.user.uid));
    
    if (!userDoc.exists()) {
      await setDoc(doc(db, COLLECTIONS.USERS, userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: userCredential.user.email || "",
        displayName: userCredential.user.phoneNumber || "User",
        phoneNumber: userCredential.user.phoneNumber,
        photoURL: userCredential.user.photoURL || "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      // Update existing user
      await updateDoc(doc(db, COLLECTIONS.USERS, userCredential.user.uid), {
        phoneNumber: userCredential.user.phoneNumber,
        updatedAt: serverTimestamp(),
      });
    }

    confirmationResult = null; // Reset for next use
    return userCredential.user;
  } catch (error) {
    console.error("OTP verification error:", error);
    throw error;
  }
}

export function resetPhoneAuth() {
  confirmationResult = null;
}

// Export initialized flag and auth
export { firebaseInitialized, auth };