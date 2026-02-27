import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Accountant.AI | Portable Ledger",
    description: "Intelligent document management and ledger system for accountants.",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Accountant.AI",
    },
};

export const viewport: Viewport = {
    themeColor: "#059669",
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
            <body className={cn(inter.className, "bg-neutral-50 min-h-screen")}>
                <Sidebar />
                <main className="lg:pl-64 min-h-screen pt-20 lg:pt-0">
                    <div className="p-4 md:p-8 max-w-7xl mx-auto page-transition">
                        {children}
                    </div>
                </main>
            </body>
        </html>
    );
}
