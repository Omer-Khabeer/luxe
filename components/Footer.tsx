// "use client";
// import React, { useState } from "react";
// import {
//   Github,
//   Twitter,
//   Instagram,
//   Linkedin,
//   Mail,
//   Phone,
//   MapPin,
//   ArrowUp,
//   ChevronRight,
//   Heart,
// } from "lucide-react";

// const Footer = () => {
//   const [isEmailFocused, setIsEmailFocused] = useState(false);
//   const [email, setEmail] = useState("");

//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setEmail("");
//     // Handle newsletter subscription
//   };

//   return (
//     <footer className="bg-gray-900 text-gray-300 relative">
//       {/* Animated wave pattern */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-500/20 to-transparent transform -skew-y-6 animate-pulse" />
//           <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-500/20 to-transparent transform skew-y-6 animate-pulse" />
//         </div>
//       </div>

//       {/* Main footer content */}
//       <div className="max-w-7xl mx-auto px-4 py-12 relative">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {/* Company Info */}
//           <div className="space-y-4 transform hover:scale-105 transition-transform duration-300">
//             <h3 className="text-2xl font-bold text-white">Luxe</h3>
//             <p className="text-gray-400">
//               Creating amazing experiences through innovation and dedication.
//             </p>
//             <div className="flex space-x-4">
//               <a
//                 href="#"
//                 className="hover:text-white transition-colors duration-300 hover:scale-110 transform"
//               >
//                 <Twitter className="w-5 h-5" />
//               </a>
//               <a
//                 href="#"
//                 className="hover:text-white transition-colors duration-300 hover:scale-110 transform"
//               >
//                 <Instagram className="w-5 h-5" />
//               </a>
//               <a
//                 href="#"
//                 className="hover:text-white transition-colors duration-300 hover:scale-110 transform"
//               >
//                 <Linkedin className="w-5 h-5" />
//               </a>
//               <a
//                 href="#"
//                 className="hover:text-white transition-colors duration-300 hover:scale-110 transform"
//               >
//                 <Github className="w-5 h-5" />
//               </a>
//             </div>
//           </div>

//           {/* Quick Links */}
//           <div className="space-y-4">
//             <h3 className="text-xl font-semibold text-white">Quick Links</h3>
//             <ul className="space-y-2">
//               {["About Us", "Services", "Products", "Contact"].map((item) => (
//                 <li
//                   key={item}
//                   className="group flex items-center hover:translate-x-2 transition-transform duration-300"
//                 >
//                   <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                   <a
//                     href="#"
//                     className="hover:text-white transition-colors duration-300"
//                   >
//                     {item}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Contact Info */}
//           <div className="space-y-4">
//             <h3 className="text-xl font-semibold text-white">Contact Us</h3>
//             <ul className="space-y-4">
//               <li className="flex items-center space-x-3 group hover:translate-x-2 transition-transform duration-300">
//                 <Mail className="w-5 h-5 group-hover:text-blue-400 transition-colors duration-300" />
//                 <span>info@luxe.com</span>
//               </li>
//               <li className="flex items-center space-x-3 group hover:translate-x-2 transition-transform duration-300">
//                 <Phone className="w-5 h-5 group-hover:text-blue-400 transition-colors duration-300" />
//                 <span>+1 234 567 890</span>
//               </li>
//               <li className="flex items-center space-x-3 group hover:translate-x-2 transition-transform duration-300">
//                 <MapPin className="w-5 h-5 group-hover:text-blue-400 transition-colors duration-300" />
//                 <span>123 Business Street, NY</span>
//               </li>
//             </ul>
//           </div>

//           {/* Newsletter */}
//           <div className="space-y-4">
//             <h3 className="text-xl font-semibold text-white">Newsletter</h3>
//             <p className="text-gray-400">
//               Subscribe to our newsletter for updates.
//             </p>
//             <form onSubmit={handleSubmit} className="relative">
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 onFocus={() => setIsEmailFocused(true)}
//                 onBlur={() => setIsEmailFocused(false)}
//                 placeholder="Enter your email"
//                 className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//               />
//               <button
//                 type="submit"
//                 className={`absolute right-2 top-2 bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 transition-all duration-300 transform ${
//                   isEmailFocused ? "scale-105" : ""
//                 }`}
//               >
//                 Subscribe
//               </button>
//             </form>
//           </div>
//         </div>

//         {/* Bottom bar */}
//         <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
//           <p className="text-sm flex items-center">
//             © 2025 Company Name. Made with
//             <Heart className="w-4 h-4 mx-1 text-red-500 animate-pulse" />
//             by Our Team
//           </p>
//           <div className="flex items-center space-x-4">
//             <a
//               href="#"
//               className="text-sm hover:text-white transition-colors duration-300"
//             >
//               Privacy Policy
//             </a>
//             <a
//               href="#"
//               className="text-sm hover:text-white transition-colors duration-300"
//             >
//               Terms of Service
//             </a>
//             <button
//               onClick={scrollToTop}
//               className="bg-blue-500 p-2 rounded-full hover:bg-blue-600 transition-colors duration-300 transform hover:scale-110 focus:outline-none"
//             >
//               <ArrowUp className="w-5 h-5 text-white" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import Link from "next/link";
import { Facebook, Instagram, Nut, Mail, Phone } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-amber-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">
                <Nut className="w-7 h-7 text-amber-600" />
              </span>
              <span className="text-xl font-bold">ISSNUSS</span>
            </div>
            <p className="text-amber-100 mb-6">
              Unser Online-Shop bietet eine breite Palette von köstlichen und
              frischen Nüssen, die sorgfältig ausgewählt und verarbeitet werden,
              um Ihnen die besten Aromen und ernährungsphysiologischen Vorteile
              zu bieten.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-6 h-6 text-amber-300 hover:text-white cursor-pointer" />
              <Instagram className="w-6 h-6 text-amber-300 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Links</h3>
            <div className="space-y-2">
              <Link
                href="/shop"
                className="block text-amber-100 hover:text-white"
              >
                Shop
              </Link>
              <Link
                href="/nuts"
                className="block text-amber-100 hover:text-white"
              >
                Nüsse
              </Link>
              <Link
                href="/dried-fruits"
                className="block text-amber-100 hover:text-white"
              >
                Trockenfrüchte
              </Link>
              <Link
                href="/cart"
                className="block text-amber-100 hover:text-white"
              >
                Warenkorb
              </Link>
              <Link
                href="/checkout"
                className="block text-amber-100 hover:text-white"
              >
                Kasse
              </Link>
              <Link
                href="/contact"
                className="block text-amber-100 hover:text-white"
              >
                Kontakt
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-bold mb-4">Rechtliche Seiten</h3>
            <div className="space-y-2">
              <Link
                href="/privacy"
                className="block text-amber-100 hover:text-white"
              >
                Datenschutz
              </Link>
              <Link
                href="/imprint"
                className="block text-amber-100 hover:text-white"
              >
                Impressum
              </Link>
              <Link
                href="/terms"
                className="block text-amber-100 hover:text-white"
              >
                AGB
              </Link>
              <Link
                href="/returns"
                className="block text-amber-100 hover:text-white"
              >
                Widerrufsrecht
              </Link>
              <Link
                href="/shipping"
                className="block text-amber-100 hover:text-white"
              >
                Versandrechtslinien
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Kontakt</h3>
            <div className="space-y-2 text-amber-100">
              <p>
                35415 Pohlheim
                <br />
                Deutschland
              </p>
              <p>
                <Phone className="w-4 h-4" /> +491708297842
              </p>
              <p>
                <Mail className="w-4 h-4" /> info@issnuss.pixel-crafting.com
              </p>
            </div>
            <div className="mt-6">
              <div className="bg-amber-600 p-2 rounded inline-block">
                <span className="text-xl font-bold">
                  <Image
                    src="https://www.dhl.com/content/dam/dhl/global/core/images/logos/dhl-logo.svg"
                    alt="shop-hero"
                    width={800}
                    height={600}
                    priority
                  />
                </span>
              </div>
              <div className="flex space-x-2 mt-2">
                <div className="text-white px-2 py-1 text-xs rounded">
                  <Image
                    src="/Mastercard-Logo.wine.svg"
                    alt="shop-hero"
                    width={800}
                    height={600}
                    priority
                  />
                </div>
                <div className="text-white px-2 py-1 text-xs rounded">
                  <Image
                    src="/Paypal-Logo.wine.svg"
                    alt="shop-hero"
                    width={800}
                    height={600}
                    priority
                  />
                </div>
                <div className="text-white px-2 py-1 text-xs rounded">
                  <Image
                    src="/Visa_Inc.-Logo.wine.svg"
                    alt="shop-hero"
                    width={800}
                    height={600}
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-amber-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-amber-200 text-sm">Copyright © 2025 - Issnuss</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/imprint"
              className="text-amber-200 text-sm hover:text-white"
            >
              IMPRESSUM
            </Link>
            <Link
              href="/privacy"
              className="text-amber-200 text-sm hover:text-white"
            >
              DATENSCHUTZ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
