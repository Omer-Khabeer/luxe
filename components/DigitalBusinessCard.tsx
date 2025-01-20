// "use client";
// import React, { useState } from "react";
// import { ArrowUpRight, Download, ArrowRight } from "lucide-react";

// const DigitalBusinessCard = () => {
//   const [showCard, setShowCard] = useState(false);

//   return (
//     <div className="w-full max-w-6xl mx-auto p-6 bg-white">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
//         {/* Left Section - Card */}
//         <div className="space-y-6">
//           <h1 className="text-4xl md:text-5xl font-bold">
//             What are{" "}
//             <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
//               digital
//             </span>{" "}
//             business cards?
//           </h1>

//           <p className="text-gray-600 text-lg">
//             Leave paper business cards in the past and never lose a contact
//             again.
//           </p>

//           <button
//             onClick={() => setShowCard(true)}
//             className="group flex items-center gap-2 px-6 py-3 rounded-full border border-purple-200 hover:border-purple-300 transition-colors"
//           >
//             Tap to view card
//             <ArrowRight className="group-hover:translate-x-1 transition-transform" />
//           </button>
//         </div>

//         {/* Right Section - iPhone */}
//         <div className="relative">
//           <div className="w-[320px] h-[640px] mx-auto bg-black rounded-[48px] p-4 shadow-xl relative overflow-hidden">
//             {/* iPhone Notch */}
//             <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120px] h-6 bg-black rounded-b-2xl z-20" />

//             {/* Screen Content */}
//             <div
//               className={`w-full h-full bg-white rounded-[36px] overflow-hidden transition-all duration-500 ${showCard ? "opacity-100" : "opacity-0"}`}
//             >
//               {/* Digital Card Content */}
//               <div className="p-6 space-y-8">
//                 {/* Company Logo */}
//                 <div className="w-10 h-10 bg-cyan-400 rounded-lg" />

//                 {/* Profile */}
//                 <div className="space-y-3">
//                   <div className="w-16 h-16 bg-gray-200 rounded-full" />
//                   <h3 className="text-xl font-semibold">Edward Yevseyev</h3>
//                   <p className="text-gray-600">Operations Manager</p>
//                   <p className="text-sm text-gray-500">edward@company.com</p>
//                 </div>

//                 {/* Social Icons */}
//                 <div className="flex gap-4">
//                   {["linkedin", "facebook", "instagram", "twitter"].map(
//                     (social) => (
//                       <div
//                         key={social}
//                         className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
//                       />
//                     )
//                   )}
//                 </div>

//                 {/* Links Section */}
//                 {/* <div className="space-y-3">
//                   <h4 className="text-sm font-medium text-gray-500">Links</h4>
//                   {[
//                     { text: "Explore the range", icon: ArrowUpRight },
//                     { text: "Download brochure", icon: Download },
//                     { text: "Book a meeting", icon: ArrowUpRight },
//                   ].map((link) => (
//                     <button
//                       key={link.text}
//                       className="flex items-center justify-between w-full p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
//                     >
//                       <span>{link.text}</span>
//                       <link.icon size={16} />
//                     </button>
//                   ))}
//                 </div> */}

//                 {/* Save Contact Button */}
//                 {/* <button className="flex items-center justify-center gap-2 w-full p-4 rounded-xl bg-cyan-400 text-white hover:bg-cyan-500 transition-colors">
//                   Save contact
//                   <ArrowRight size={18} />
//                 </button> */}
//               </div>
//             </div>
//           </div>

//           {/* iPhone Side Button */}
//           <div className="absolute top-24 -right-2 w-2 h-12 bg-gray-800 rounded-l-lg" />
//         </div>
//       </div>

//       {/* Features Section */}
//       {/* <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-8">
//         <div className="space-y-4">
//           <h2 className="text-2xl font-bold">Digital profile</h2>
//           <p className="text-gray-600">
//             All your personal and company information in one place.
//           </p>
//         </div>
//         <div className="space-y-4">
//           <h2 className="text-2xl font-bold">Instant sharing</h2>
//           <p className="text-gray-600">
//             Share your contact with the click of a button.
//           </p>
//         </div>
//       </div> */}
//     </div>
//   );
// };

// export default DigitalBusinessCard;
