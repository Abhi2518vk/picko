"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, User, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/app/providers";
import { SafeStorage } from "@/lib/storage";

export default function PersonalInfoPage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [gender, setGender] = useState<"male" | "female" | "other">("other");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Update user data with name and gender
      const updatedUser: typeof user = {
        ...user!,
        name: name.trim(),
        gender: gender,
      };

      // Save to storage
      SafeStorage.setJSON("user", updatedUser);
      setUser(updatedUser);

      // Redirect to home page
      router.push("/");
    } catch (err: any) {
      console.error("Error saving personal info:", err);
      setError("Failed to save information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-0">
      {/* Header */}
      <header className="bg-white p-4 sticky top-0 z-10 shadow-sm flex items-center gap-3">
        <button onClick={() => router.back()}>
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Personal Information</h1>
      </header>

      {/* Form Container */}
      <div className="p-4 max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Complete Your Profile</h2>
            <p className="text-sm text-gray-500">
              We need this information to personalize your experience
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
            >
              {error}
            </motion.div>
          )}


          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-3.5">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 placeholder-gray-400 text-gray-900 font-medium transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Gender
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "male", label: "Male", color: "blue" },
                  { value: "female", label: "Female", color: "pink" },
                  { value: "other", label: "Other", color: "gray" },
                ].map((option) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setGender(option.value as any)}
                    className={`py-3 px-4 rounded-xl border-2 font-semibold transition-all ${
                      gender === option.value
                        ? option.color === "blue"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : option.color === "pink"
                          ? "border-pink-500 bg-pink-50 text-pink-700"
                          : "border-gray-500 bg-gray-50 text-gray-700"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                    }`}
                    disabled={loading}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              disabled={loading || !name.trim()}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Saving..." : "Save & Continue"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
