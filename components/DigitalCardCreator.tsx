// "use client";
// import React, { useState } from "react";
// import {
//   ArrowUpRight,
//   Camera,
//   Palette,
//   Layout,
//   Link,
//   User,
//   ExternalLink,
//   Instagram,
//   Facebook,
//   Linkedin,
//   Twitter,
// } from "lucide-react";

// const DigitalCardCreator = () => {
//   const [activeTab, setActiveTab] = useState("info");
//   const [theme, setTheme] = useState({
//     primary: "#2563eb",
//     background: "#000000",
//     text: "#ffffff",
//     accent: "#3b82f6",
//   });
//   const [formData, setFormData] = useState({
//     name: "",
//     title: "",
//     email: "",
//     phone: "",
//     backgroundImage: null,
//     profileImage: null,
//     socialLinks: {
//       instagram: "",
//       facebook: "",
//       linkedin: "",
//       twitter: "",
//     },
//     links: [
//       { title: "Portfolio", url: "" },
//       { title: "Resume", url: "" },
//       { title: "Blog", url: "" },
//     ],
//   });

//   const handleInputChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleThemeChange = (color, type) => {
//     setTheme((prev) => ({
//       ...prev,
//       [type]: color,
//     }));
//   };

//   const presetThemes = [
//     {
//       name: "Midnight",
//       colors: {
//         primary: "#2563eb",
//         background: "#000000",
//         text: "#ffffff",
//         accent: "#3b82f6",
//       },
//     },
//     {
//       name: "Forest",
//       colors: {
//         primary: "#059669",
//         background: "#064e3b",
//         text: "#ffffff",
//         accent: "#10b981",
//       },
//     },
//     {
//       name: "Ruby",
//       colors: {
//         primary: "#dc2626",
//         background: "#7f1d1d",
//         text: "#ffffff",
//         accent: "#ef4444",
//       },
//     },
//     {
//       name: "Royal",
//       colors: {
//         primary: "#7c3aed",
//         background: "#4c1d95",
//         text: "#ffffff",
//         accent: "#8b5cf6",
//       },
//     },
//   ];

//   const socialIcons = {
//     instagram: <Instagram size={16} />,
//     facebook: <Facebook size={16} />,
//     linkedin: <Linkedin size={16} />,
//     twitter: <Twitter size={16} />,
//   };

//   const handleSocialLinkChange = (platform: string, value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       socialLinks: {
//         ...prev.socialLinks,
//         [platform]: value,
//       },
//     }));
//   };

//   const handleFileChange = (e, type) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setFormData((prev) => ({
//           ...prev,
//           [type]: e.target.result,
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleLinkChange = (index, field, value) => {
//     const newLinks = [...formData.links];
//     newLinks[index] = { ...newLinks[index], [field]: value };
//     setFormData((prev) => ({ ...prev, links: newLinks }));
//   };

//   return (
//     <div className="w-full max-w-6xl mx-auto p-6 bg-gray-50">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
//         {/* Editor Section */}

//         <div className="space-y-8">
//           <div className="flex justify-between items-center">
//             <h2 className="text-2xl font-bold">Card Editor</h2>

//             <div className="flex gap-2">
//               {["info", "style", "links"].map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveTab(tab)}
//                   className={`px-4 py-2 rounded-lg transition-all transform hover:scale-105 ${
//                     activeTab === tab
//                       ? "bg-blue-500 text-white shadow-lg"
//                       : "bg-white text-gray-600"
//                   }`}
//                 >
//                   {tab === "info" && <User className="w-4 h-4" />}
//                   {tab === "style" && <Palette className="w-4 h-4" />}
//                   {tab === "links" && <Link className="w-4 h-4" />}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
//             {activeTab === "info" && (
//               <div className="space-y-4 animate-fadeIn">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="col-span-2">
//                     <label className="block text-sm font-medium mb-2">
//                       Profile Image
//                     </label>
//                     <div className="flex items-center gap-4">
//                       <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-blue-200">
//                         {formData.profileImage ? (
//                           <img
//                             src={formData.profileImage}
//                             alt="Profile"
//                             className="w-full h-full object-cover"
//                             onChange={(e) =>
//                               handleImageUpload(e, "profileImage")
//                             }
//                           />
//                         ) : (
//                           <Camera className="text-gray-400" />
//                         )}
//                       </div>
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => handleFileChange(e, "profileImage")}
//                         className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                       />
//                     </div>
//                   </div>

//                   <div className="col-span-2">
//                     <label className="block text-sm font-medium mb-2">
//                       Background Image
//                     </label>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                     />
//                   </div>

//                   {["name", "title", "email", "phone"].map((field) => (
//                     <div key={field} className="col-span-2">
//                       <label className="block text-sm font-medium mb-2 capitalize">
//                         {field}
//                       </label>
//                       <input
//                         type={field === "email" ? "email" : "text"}
//                         name={field}
//                         value={formData[field]}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-shadow"
//                       />
//                     </div>
//                   ))}

//                   <div className="col-span-2 space-y-4">
//                     <h3 className="font-medium">Social Media Links</h3>
//                     {Object.keys(formData.socialLinks).map((platform) => (
//                       <div key={platform} className="flex items-center gap-2">
//                         <span className="w-8">{socialIcons[platform]}</span>
//                         <input
//                           type="url"
//                           value={formData.socialLinks[platform]}
//                           onChange={(e) =>
//                             handleSocialLinkChange(platform, e.target.value)
//                           }
//                           placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
//                           className="flex-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeTab === "style" && (
//               <div className="space-y-6 animate-fadeIn">
//                 <div className="grid grid-cols-2 gap-4">
//                   {Object.entries(theme).map(([type, color]) => (
//                     <div key={type}>
//                       <label className="block text-sm font-medium mb-2 capitalize">
//                         {type} Color
//                       </label>
//                       <div className="flex gap-2">
//                         <input
//                           type="color"
//                           value={color}
//                           onChange={(e) =>
//                             handleThemeChange(e.target.value, type)
//                           }
//                           className="h-10 w-20"
//                         />
//                         <input
//                           type="text"
//                           value={color}
//                           onChange={(e) =>
//                             handleThemeChange(e.target.value, type)
//                           }
//                           className="flex-1 px-3 rounded-lg border"
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div>
//                   <h3 className="text-sm font-medium mb-3">Preset Themes</h3>
//                   <div className="grid grid-cols-4 gap-2">
//                     {presetThemes.map((preset) => (
//                       <button
//                         key={preset.name}
//                         onClick={() => setTheme(preset.colors)}
//                         className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
//                       >
//                         <div
//                           className="w-full h-12 rounded-lg mb-1"
//                           style={{ background: preset.colors.primary }}
//                         />
//                         <span className="text-xs">{preset.name}</span>
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeTab === "links" && (
//               <div className="space-y-4 animate-fadeIn">
//                 {formData.links.map((link, index) => (
//                   <div key={index} className="grid grid-cols-2 gap-2">
//                     <input
//                       type="text"
//                       value={link.title}
//                       placeholder="Link Title"
//                       className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                     />
//                     <input
//                       type="url"
//                       value={link.url}
//                       placeholder="URL"
//                       className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Preview Section */}
//         <div className="relative">
//           <div
//             className="w-[320px] h-[640px] mx-auto rounded-[48px] p-4 shadow-xl relative overflow-hidden transition-colors duration-300"
//             style={{ background: theme.background }}
//           >
//             <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120px] h-6 bg-black rounded-b-2xl z-20" />

//             <div className="w-full h-full rounded-[36px] overflow-hidden bg-white">
//               {/* Banner Section */}
//               <div
//                 className="h-40 relative flex items-center justify-center"
//                 style={{ background: theme.primary }}
//               >
//                 <div className="absolute bottom-0 transform translate-y-1/2 w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
//                   {formData.profileImage ? (
//                     <img
//                       src={formData.profileImage}
//                       alt="Profile"
//                       onChange={(e) => handleFileChange(e, "profileImage")}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-full h-full bg-gray-100 flex items-center justify-center">
//                       <Camera size={32} className="text-gray-400" />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Profile Content */}
//               <div className="px-6 mt-20 space-y-6">
//                 <div className="text-center space-y-2">
//                   <h2
//                     className="text-xl font-bold"
//                     style={{ color: theme.primary }}
//                   >
//                     {formData.name}
//                   </h2>
//                   <p className="text-gray-600">{formData.title}</p>
//                   <p className="text-sm text-gray-500">{formData.email}</p>
//                   <p className="text-sm text-gray-500">{formData.phone}</p>
//                 </div>

//                 <div className="flex justify-center gap-4">
//                   {Object.entries(formData.socialLinks).map(
//                     ([platform, url]) =>
//                       url && (
//                         <button
//                           key={platform}
//                           className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
//                           style={{
//                             background: theme.accent,
//                             color: theme.text,
//                           }}
//                         >
//                           {socialIcons[platform]}
//                         </button>
//                       )
//                   )}
//                 </div>

//                 {/* <div className="flex justify-center gap-4">
//                   {[Linkedin, Facebook, Instagram, Twitter].map((Icon, i) => (
//                     <button
//                       key={i}
//                       className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100"
//                     >
//                       <Icon size={20} className="text-gray-600" />
//                     </button>
//                   ))}
//                 </div> */}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DigitalCardCreator;
