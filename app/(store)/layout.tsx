import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import { SanityLive } from "@/sanity/lib/live";
import { CartProvider } from "@/hooks/useCart";

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});

export const metadata: Metadata = {
  title: "Luxe | E-commerce Shop",
  description: "Created by Omer Tech",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic>
      <html
        lang="en"
        className={`${raleway.variable}`}
        suppressHydrationWarning
      >
        <body>
          <CartProvider>
            <main>
              <Header />
              {children}
            </main>
            <SanityLive />
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
