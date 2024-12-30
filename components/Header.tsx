"use client";
import React, { useState } from "react";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  Package,
} from "lucide-react";
import { ClerkLoaded, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Form from "next/form";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartCount] = useState(3);
  const { isSignedIn, user } = useUser();

  const categories = ["New Arrivals", "Women", "Men", "Accessories", "Sale"];

  return (
    <div className="sticky top-0 z-50 w-full">
      <div className="bg-black text-white text-center py-2 text-sm">
        Free shipping on orders over $100
      </div>

      <header className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <button
                className="lg:hidden mr-4 p-2 hover:bg-gray-100 rounded-full"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link href="/" className="text-2xl font-bold">
                LUXE
              </Link>
            </div>

            <nav className="hidden lg:flex items-center space-x-8">
              {categories.map((category) => (
                <div key={category} className="group relative py-3">
                  <button className="flex items-center gap-1 hover:text-gray-600">
                    <span>{category}</span>
                    <ChevronDown size={16} />
                  </button>
                  <div className="absolute top-full hidden group-hover:block w-48 bg-white shadow-lg rounded-md py-2">
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                      Subcategory 1
                    </a>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                      Subcategory 2
                    </a>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                      Subcategory 3
                    </a>
                  </div>
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              {/* Search bar */}
              <Form action="/search">
                <input
                  name="query"
                  type="text"
                  placeholder="Search products..."
                  className="w-full p-2 focus:outline-none"
                  autoFocus
                />
                {/* <div className="relative">
                  <button
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <Search size={24} />
                  </button>
                  {isSearchOpen && (
                    <div className="absolute right-0 top-full mt-2 w-96 bg-white shadow-lg rounded-lg p-4">
                      <div className="flex items-center border-b">
                        <Search size={20} className="text-gray-400" />
                       
                      </div>
                    </div>
                  )}
                </div> */}
              </Form>

              {/* User Area */}

              <ClerkLoaded>
                <div className="flex items-center gap-4">
                  {isSignedIn ? (
                    <>
                      <Link
                        href="/orders"
                        className="flex items-center gap-2 hover:text-gray-600"
                      >
                        <Package size={24} />
                        <span className="hidden md:inline">My Orders</span>
                      </Link>
                      <UserButton afterSignOutUrl="/" />
                    </>
                  ) : (
                    <SignInButton mode="modal">
                      <button className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800">
                        Sign in
                      </button>
                    </SignInButton>
                  )}
                </div>
              </ClerkLoaded>

              {/* User Area */}

              <button className="p-2 hover:bg-gray-100 rounded-full relative">
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="lg:hidden border-t bg-white">
          <div className="container mx-auto px-4 py-4">
            {categories.map((category) => (
              <a
                key={category}
                href="#"
                className="block py-3 border-b hover:bg-gray-50"
              >
                {category}
              </a>
            ))}
            {isSignedIn && (
              <Link
                href="/orders"
                className="block py-3 border-b hover:bg-gray-50"
              >
                My Orders
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
