import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers/index";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthGuard } from "./AuthGuard";
import { BottomNavigation } from "./components/BottomNavigation";

export const metadata: Metadata = {
  title: "PickNGo",
  description: "Order and Pickup from your favorite local shops.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PickNGo",
  },
};

export const viewport: Viewport = {
  themeColor: "#E53935",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-100 flex justify-center min-h-screen">
        {/* Mobile View Container */}
        <main className="w-full max-w-[480px] bg-white min-h-screen shadow-2xl relative overflow-x-hidden">
          <Providers>
            <AuthGuard>
              <ErrorBoundary>
                {children}
                <BottomNavigation />
              </ErrorBoundary>
            </AuthGuard>
          </Providers>
        </main>
      </body>
    </html>
  );
}
