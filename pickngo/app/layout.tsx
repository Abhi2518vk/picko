import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import ErrorBoundary from "./components/ErrorBoundary";

export const metadata: Metadata = {
  title: "PickNGo",
  description: "Order and Pickup from your favorite local shops.",
  manifest: "/manifest.json",
  themeColor: "#FF5200",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PickNGo",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 flex justify-center min-h-screen">
        {/* Mobile View Container */}
        <main className="w-full max-w-[480px] bg-white min-h-screen shadow-2xl relative overflow-x-hidden">
          <Providers>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </Providers>
        </main>
      </body>
    </html>
  );
}
