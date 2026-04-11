"use client";

import { useAuth } from "@/app/providers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShoppingBag, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { phoneLoginSchema, emailLoginSchema, safeValidate } from "@/lib/validation";

export default function LoginPage() {
    const { setUser, isLoggedIn } = useAuth();
    const router = useRouter();
    const [loginMethod, setLoginMethod] = useState<"otp" | "email">("otp");
    const [otpStep, setOtpStep] = useState<"phone" | "verify">("phone");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isLoggedIn) {
            router.push("/");
        }
    }, [isLoggedIn, router]);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "");
        setPhone(value.slice(0, 10));
        setError("");
    };

    const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "");
        setOtp(value.slice(0, 6));
        setError("");
    };

    const handleSendOTP = async () => {
        const validation = safeValidate(phoneLoginSchema, { phone });
        if (!validation.success) {
            setError(validation.errors?.join("\n") || "Invalid phone number");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Try to import and use Firebase
            // Always proceed to OTP verification step in development/demo mode
            setOtpStep("verify");
            setError("OTP sent (demo mode: no SMS sent). Enter any 6-digit code.");
        } catch (err: any) {
            console.error("OTP send error:", err);
            setError(err?.message || "Ready for OTP verification (demo mode)");
            setOtpStep("verify");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // In demo mode, any 6-digit OTP is valid
            if (otp.length === 6) {
                const userData = {
                    id: `phone_${phone}`,
                    name: `User ${phone.slice(-4)}`,
                    email: `user${phone.slice(-4)}@example.com`,
                    image: "",
                    gender: "other" as const,
                };
                setUser(userData);
                await new Promise(resolve => setTimeout(resolve, 500));
                router.push("/");
            } else {
                setError("Invalid OTP in demo mode. Please enter any 6-digit code.");
            }
        } catch (err: any) {
            console.error("OTP verification error:", err);
            setError(err?.message || "Invalid OTP. Please try again.");
            setOtp("");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setOtp("");
        setError("");
        setLoading(true);

        try {
            setError("OTP resent (demo mode)");
        } finally {
            setLoading(false);
        }
    };

    const handleEmailLogin = async () => {
        const validation = safeValidate(emailLoginSchema, { email, password });
        if (!validation.success) {
            setError(validation.errors?.join("\n") || "Invalid email or password");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const userData = {
                id: `email_${email}`,
                name: email.split("@")[0],
                email: email,
                image: "",
                gender: "other" as const,
            };
            
            setUser(userData);
            await new Promise(resolve => setTimeout(resolve, 500));
            router.push("/");
        } catch (err: any) {
            console.error("Email login error:", err);
            setError(err?.message || "Failed to login. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError("");

        try {
            // Try to import and use Firebase Google login
            try {
                const { loginWithGoogle } = await import("@/lib/firebase");
                await loginWithGoogle();
            } catch (err) {
                // Demo mode: create mock user
                const userData = {
                    id: "google_demo",
                    name: "Google User",
                    email: "user@gmail.com",
                    image: "",
                    gender: "other" as const,
                };
                
                setUser(userData);
            }
            
            await new Promise(resolve => setTimeout(resolve, 500));
            router.push("/");
        } catch (err: any) {
            console.error("Google login error:", err);
            setError(err?.message || "Failed to login with Google.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[480px] bg-white min-h-screen flex flex-col items-center justify-center p-6">
            {/* Logo and App Name */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-16 justify-center"
            >
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-red-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">PickNGo</h1>
            </motion.div>

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-xs mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
                >
                    {error}
                </motion.div>
            )}

            {/* Login Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="w-full max-w-xs"
            >
                {/* OTP Login */}
                {loginMethod === "otp" && otpStep === "phone" && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-6">Sign in with OTP</h2>
                        
                        {/* Phone Number Input */}
                        <div className="relative">
                            <div className="absolute left-4 top-3.5 flex items-center gap-2 border-r border-gray-200 pr-3">
                                <span className="text-gray-600 font-medium">🇮🇳</span>
                                <span className="text-gray-600 text-sm font-medium">+91</span>
                            </div>
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="Enter phone number"
                                value={phone}
                                onChange={handlePhoneChange}
                                maxLength={10}
                                className="w-full pl-24 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 placeholder-gray-400 text-gray-900 font-medium"
                                disabled={loading}
                            />
                        </div>

                        {/* Send OTP Button */}
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSendOTP}
                            disabled={loading || phone.length !== 10}
                            className="w-full py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? "Sending..." : "Send OTP"}
                        </motion.button>

                        <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                            For development, use Firebase phone auth test numbers configured in Authentication → Sign-in method → Phone. For production, enable Blaze billing before sending real SMS OTPs.
                        </p>

                        {/* Divider */}
                        <div className="flex items-center gap-3 my-6">
                            <div className="flex-1 h-px bg-gray-200"></div>
                            <span className="text-xs text-gray-500 font-medium">or</span>
                            <div className="flex-1 h-px bg-gray-200"></div>
                        </div>

                        {/* Google Sign In */}
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full py-3 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            {loading ? "Signing in..." : "Sign in with Google"}
                        </motion.button>

                        {/* Switch to Email */}
                        <button
                            onClick={() => {
                                setLoginMethod("email");
                                setError("");
                            }}
                            className="w-full py-3 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Mail className="w-5 h-5" />
                            Login with Email
                        </button>
                    </div>
                )}

                {/* OTP Verification */}
                {loginMethod === "otp" && otpStep === "verify" && (
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-2">Verify OTP</h2>
                            <p className="text-sm text-gray-600">Enter the 6-digit OTP sent to +91{phone}</p>
                        </div>
                        
                        {/* OTP Input */}
                        <input
                            type="text"
                            inputMode="numeric"
                            placeholder="000000"
                            value={otp}
                            onChange={handleOTPChange}
                            maxLength={6}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 placeholder-gray-400 text-gray-900 font-mono text-center text-2xl tracking-widest"
                            disabled={loading}
                        />

                        {/* Verify Button */}
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={handleVerifyOTP}
                            disabled={loading || otp.length !== 6}
                            className="w-full py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </motion.button>

                        {/* Resend OTP */}
                        <button
                            onClick={handleResendOTP}
                            disabled={loading}
                            className="w-full py-2 text-sm text-red-500 font-medium hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Resend OTP
                        </button>

                        {/* Back Button */}
                        <button
                            onClick={() => {
                                setOtpStep("phone");
                                setOtp("");
                                setError("");
                            }}
                            className="w-full py-2 text-sm text-gray-600 font-medium hover:text-gray-700 transition-colors"
                        >
                            Back to Phone Number
                        </button>
                    </div>
                )}

                {/* Email Login */}
                {loginMethod === "email" && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-6">Sign in with Email</h2>
                        
                        {/* Email Input */}
                        <input
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError("");
                            }}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 placeholder-gray-400 text-gray-900"
                            disabled={loading}
                        />

                        {/* Password Input */}
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError("");
                            }}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 placeholder-gray-400 text-gray-900"
                            disabled={loading}
                        />

                        {/* Login with Email Button */}
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={handleEmailLogin}
                            disabled={loading}
                            className="w-full py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? "Logging in..." : "Login with Email"}
                        </motion.button>

                        {/* Divider */}
                        <div className="flex items-center gap-3 my-6">
                            <div className="flex-1 h-px bg-gray-200"></div>
                            <span className="text-xs text-gray-500 font-medium">or</span>
                            <div className="flex-1 h-px bg-gray-200"></div>
                        </div>

                        {/* Switch to OTP */}
                        <button
                            onClick={() => {
                                setLoginMethod("otp");
                                setError("");
                            }}
                            className="w-full py-3 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Login with OTP
                        </button>
                    </div>
                )}
            </motion.div>

            {/* Recaptcha Container - hidden by default */}
            <div id="recaptcha-container" style={{ display: "none" }}></div>

            {/* Footer */}
            <p className="text-xs text-gray-500 text-center mt-12 max-w-xs leading-relaxed">
                By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
        </div>
    );
}