// "use client";
// import React, { useState, useEffect } from "react";
// import { Search, ShoppingCart, Menu, X, ChevronDown, User } from "lucide-react";
// import { ClerkLoaded, UserButton, useUser, SignInButton } from "@clerk/nextjs";
// import Link from "next/link";
// import Form from "next/form";

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [cartCount] = useState(3);
//   const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [hoveredItem, setHoveredItem] = useState<string | null>(null);
//   const { isSignedIn, user, isLoaded } = useUser();

//   // Handle scroll effect
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 20);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const currencies = [
//     { code: "EUR", symbol: "€", flag: "🇪🇺", name: "Euro" },
//     { code: "USD", symbol: "$", flag: "🇺🇸", name: "US Dollar" },
//     { code: "GBP", symbol: "£", flag: "🇬🇧", name: "British Pound" },
//   ];

//   const navigationItems = [
//     {
//       name: "Products",
//       hasDropdown: true,
//       collections: [
//         { title: "Cards", image: "hero.webp", link: "/products/cards" },
//         { title: "Stands", image: "hero.webp", link: "/products/stands" },
//         {
//           title: "Custom Products",
//           image: "hero.webp",
//           link: "/products/custom",
//         },
//         { title: "All Products", image: "hero.webp", link: "/products" },
//       ],
//     },
//     { name: "Features", hasDropdown: false, link: "/features" },
//     { name: "Pricing", hasDropdown: false, link: "/pricing" },
//     { name: "FAQs", hasDropdown: false, link: "/faqs" },
//   ];

//   // Cart button component
//   const CartButton = () => (
//     <Link href="/cart">
//       <button className="p-2 hover:bg-gray-100 rounded-full relative transition-transform duration-300 hover:scale-110">
//         <ShoppingCart
//           size={20}
//           className="transition-transform duration-300 hover:rotate-12"
//         />
//         {cartCount > 0 && (
//           <span className="absolute -top-1 -right-1 bg-purple-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs animate-bounce">
//             {cartCount}
//           </span>
//         )}
//       </button>
//     </Link>
//   );

//   // Authentication button component
//   const renderAuthButton = () => {
//     if (!isLoaded) {
//       return (
//         <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
//       );
//     }

//     if (isSignedIn) {
//       return (
//         <div className="flex items-center gap-4">
//           <UserButton
//             afterSignOutUrl="/"
//             appearance={{
//               elements: {
//                 avatarBox: "w-9 h-9",
//               },
//             }}
//           />
//           <CartButton />
//         </div>
//       );
//     }

//     return (
//       <div className="flex items-center gap-4">
//         <SignInButton mode="modal">
//           <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-all duration-300 hover:scale-105">
//             <User size={18} />
//             <span>Sign In</span>
//           </button>
//         </SignInButton>
//       </div>
//     );
//   };

//   return (
//     <div
//       className={`sticky top-0 z-50 w-full transition-all duration-300 ${
//         scrolled ? "bg-white/90 backdrop-blur-md shadow-lg" : "bg-white"
//       }`}
//     >
//       <header className="border-b border-gray-100">
//         <div className="container mx-auto px-4">
//           <div className="flex h-16 items-center justify-between">
//             {/* Left Section - Logo and Nav */}
//             <div className="flex items-center space-x-12">
//               {/* Mobile Menu Button */}
//               <button
//                 className="lg:hidden mr-4 p-2 hover:bg-gray-100 rounded-full transition-transform duration-300 hover:rotate-180"
//                 onClick={() => setIsMenuOpen(!isMenuOpen)}
//                 aria-label="Toggle Menu"
//               >
//                 {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
//               </button>

//               {/* Logo */}
//               <Link href="/" className="group flex items-center">
//                 <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-2 transition-all duration-300 group-hover:rotate-45 group-hover:scale-110">
//                   <div className="w-4 h-4 bg-white rounded-sm transition-transform duration-300 group-hover:rotate-45"></div>
//                 </div>
//                 <span className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
//                   Luxe
//                 </span>
//               </Link>

//               {/* Desktop Navigation */}
//               <nav className="hidden lg:flex items-center space-x-8">
//                 {navigationItems.map((item) => (
//                   <div
//                     key={item.name}
//                     className="group relative"
//                     onMouseEnter={() => setHoveredItem(item.name)}
//                     onMouseLeave={() => setHoveredItem(null)}
//                   >
//                     {item.hasDropdown ? (
//                       <button
//                         className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-all duration-300 ${
//                           hoveredItem === item.name
//                             ? "bg-purple-600 text-white scale-105"
//                             : "text-black font-bold hover:text-gray-900"
//                         }`}
//                       >
//                         <span>{item.name}</span>
//                         <ChevronDown
//                           size={16}
//                           className={`transition-transform duration-300 ${
//                             hoveredItem === item.name ? "rotate-180" : ""
//                           }`}
//                         />
//                       </button>
//                     ) : (
//                       <Link
//                         href={item.link || "#"}
//                         className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-all duration-300 ${
//                           hoveredItem === item.name
//                             ? "bg-purple-600 text-white scale-105"
//                             : "text-black font-bold hover:text-gray-900"
//                         }`}
//                       >
//                         <span>{item.name}</span>
//                       </Link>
//                     )}
//                     {item.hasDropdown && (
//                       <div className="absolute top-full left-0 w-screen max-w-5xl mx-auto opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-white shadow-xl rounded-lg p-6 mt-1 transform translate-y-2 group-hover:translate-y-0">
//                         <div className="grid grid-cols-4 gap-6">
//                           {item.collections?.map((collection) => (
//                             <Link
//                               href={collection.link}
//                               key={collection.title}
//                               className="group/card block transition-transform duration-300 hover:scale-105 relative h-48"
//                             >
//                               <div
//                                 className="absolute inset-0 bg-cover bg-center rounded-lg"
//                                 style={{
//                                   backgroundImage: `url(${collection.image})`,
//                                 }}
//                               ></div>
//                               <div className="relative z-10 p-4 bg-black bg-opacity-50 rounded-lg flex flex-col justify-end h-full">
//                                 <h3 className="text-lg font-medium text-white mb-2">
//                                   {collection.title}
//                                 </h3>
//                                 <div className="text-sm text-white flex items-center">
//                                   View the collection
//                                   <svg
//                                     className="w-4 h-4 ml-1 transition-transform duration-300 group-hover/card:translate-x-1"
//                                     viewBox="0 0 16 16"
//                                     fill="none"
//                                   >
//                                     <path
//                                       d="M6 12L10 8L6 4"
//                                       stroke="currentColor"
//                                       strokeWidth="1.5"
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                     />
//                                   </svg>
//                                 </div>
//                               </div>
//                             </Link>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </nav>
//             </div>

//             {/* Right Section */}
//             <div className="flex items-center space-x-6">
//               {/* Currency Selector */}
//               <div className="hidden md:block relative">
//                 <button
//                   onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
//                   className="flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-gray-50 transition-all duration-300 hover:scale-105"
//                 >
//                   <span className="text-lg">🇪🇺</span>
//                   <span className="text-sm font-medium">EUR €</span>
//                   <ChevronDown
//                     className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${
//                       isCurrencyOpen ? "rotate-180" : ""
//                     }`}
//                   />
//                 </button>

//                 {isCurrencyOpen && (
//                   <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 animate-slideDown">
//                     {currencies.map((currency, index) => (
//                       <button
//                         key={currency.code}
//                         className="w-full px-4 py-2 flex items-center space-x-3 hover:bg-gray-50 transition-all duration-300 hover:scale-105"
//                         onClick={() => setIsCurrencyOpen(false)}
//                         style={{
//                           animationDelay: `${index * 50}ms`,
//                         }}
//                       >
//                         <span className="text-lg">{currency.flag}</span>
//                         <div className="flex flex-col items-start">
//                           <span className="text-sm font-medium text-gray-900">
//                             {currency.name}
//                           </span>
//                           <span className="text-xs text-gray-500">
//                             {currency.code} {currency.symbol}
//                           </span>
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Search Form - Desktop */}
//               <Form action="/search" className="hidden md:block">
//                 <input
//                   name="query"
//                   type="text"
//                   placeholder="Search products..."
//                   className="w-64 p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 focus:scale-105"
//                 />
//               </Form>

//               {/* Authentication Area */}
//               <ClerkLoaded>{renderAuthButton()}</ClerkLoaded>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Mobile Menu */}
//       <div
//         className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
//           isMenuOpen
//             ? "opacity-100 pointer-events-auto"
//             : "opacity-0 pointer-events-none"
//         }`}
//       >
//         <div
//           className={`bg-white w-4/5 max-w-sm h-full transform transition-transform duration-300 ${
//             isMenuOpen ? "translate-x-0" : "-translate-x-full"
//           }`}
//         >
//           <div className="container p-4">
//             {/* Mobile Auth */}
//             <div className="mb-6">
//               <ClerkLoaded>{renderAuthButton()}</ClerkLoaded>
//             </div>

//             <Form action="/search" className="mb-4">
//               <input
//                 name="query"
//                 type="text"
//                 placeholder="Search products..."
//                 className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
//               />
//             </Form>

//             {navigationItems.map((item, index) => (
//               <div
//                 key={item.name}
//                 style={{
//                   animationDelay: `${index * 100}ms`,
//                 }}
//                 className="animate-slideIn"
//               >
//                 <div className="flex items-center justify-between py-3 border-b hover:bg-gray-50 transition-colors duration-300">
//                   <span>{item.name}</span>
//                   {item.hasDropdown && <ChevronDown size={16} />}
//                 </div>
//                 {item.hasDropdown && (
//                   <div className="py-2 space-y-2">
//                     {item.collections?.map((collection, colIndex) => (
//                       <div
//                         key={collection.title}
//                         className="px-4 py-2 transform transition-all duration-300 hover:translate-x-2"
//                         style={{
//                           animationDelay: `${index * 100 + colIndex * 50}ms`,
//                         }}
//                       >
//                         <h3 className="font-medium text-gray-900 mb-1">
//                           {collection.title}
//                         </h3>
//                         <Link
//                           href={collection.link}
//                           className="inline-block bg-purple-600 text-white text-sm px-4 py-2 rounded-md hover:bg-purple-700 transition-all duration-300 hover:shadow-lg"
//                         >
//                           View Collection
//                         </Link>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <style jsx global>{`
//         @keyframes slideDown {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes slideIn {
//           from {
//             opacity: 0;
//             transform: translateX(-20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }

//         .animate-slideDown {
//           animation: slideDown 0.3s ease-out forwards;
//         }

//         .animate-slideIn {
//           animation: slideIn 0.3s ease-out forwards;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Header;
"use client";
import Link from "next/link";
import { ShoppingCart, Search, Menu } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Nut } from "lucide-react";

const Header = () => {
  const { state } = useCart(); // Add this line

  return (
    <header className="bg-amber-900 text-white">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold">
              <Nut className="w-7 h-7 text-amber-600" /> ISSNUSS
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/shop">SHOP</Link>
            <Link href="/nuts">NÜSSE</Link>
            <Link href="/dried-fruits">TROCKENFRÜCHTE</Link>
            <Link href="/cart">WARENKORB</Link>
            <Link href="/checkout">KASSE</Link>
            <Link href="/contact">KONTAKT</Link>
          </div>

          <div className="flex items-center space-x-4">
            <Search className="w-5 h-5 cursor-pointer" />

            {/* Updated cart button */}
            <Link href="/cart" className="flex items-center space-x-1 relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="text-sm">{state.total.toFixed(2)} €</span>
              {state.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {state.itemCount}
                </span>
              )}
            </Link>

            <Menu className="w-5 h-5 cursor-pointer md:hidden" />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
