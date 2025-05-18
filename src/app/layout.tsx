
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
// Removed GeistMono import as it's not found and likely unused.
// import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { CartProvider } from "@/contexts/cart-context"; // Import CartProvider

export const metadata: Metadata = {
  title: "dawabagCall",
  description: "Online video calls with doctors and health tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable}`}>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
        )}
      >
        <CartProvider> {/* Wrap with CartProvider */}
          <SidebarProvider>
            <Sidebar>
              <AppSidebar />
            </Sidebar>
            <SidebarInset>
              <div className="relative flex min-h-screen flex-col">
                <Header />
                <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
                {/* Optional Footer can be added here */}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </CartProvider>
        <Toaster />
      </body>
    </html>
  );
}
