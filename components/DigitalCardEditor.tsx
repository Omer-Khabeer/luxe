"use client";
import React, { useState } from "react";
import {
  ArrowUpRight,
  Download,
  ArrowRight,
  Camera,
  Linkedin,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

const DigitalCardPreview = () => {
  const [formData, setFormData] = useState({
    name: "Your Name",
    title: "Frontend Entwickler",
    email: "your@email.com",
    phone: "+1 234 567 890",
    backgroundImage: null,
    profileImage: null,
    links: [
      { title: "Portfolio", url: "" },
      { title: "Resume", url: "" },
      { title: "Blog", url: "" },
    ],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          [type]: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...formData.links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData((prev) => ({ ...prev, links: newLinks }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Form Section */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">Customize Your Card</h2>

          <div className="space-y-6">
            {/* Images */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Background Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "backgroundImage")}
                  className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "profileImage")}
                  className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700"
                />
              </div>
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Links */}
            <div className="space-y-4">
              <h3 className="font-medium">Custom Links</h3>
              {formData.links.map((link, index) => (
                <div key={index} className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={link.title}
                    onChange={(e) =>
                      handleLinkChange(index, "title", e.target.value)
                    }
                    placeholder="Link Title"
                    className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) =>
                      handleLinkChange(index, "url", e.target.value)
                    }
                    placeholder="URL"
                    className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="relative">
          <div className="w-[320px] h-[640px] mx-auto bg-black rounded-[48px] p-4 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120px] h-6 bg-black rounded-b-2xl z-20" />

            <div className="w-full h-full bg-white rounded-[36px] overflow-hidden">
              {/* Background Image */}
              <div className="h-48 relative">
                {formData.backgroundImage ? (
                  <img
                    src={formData.backgroundImage}
                    alt="Background"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200" />
                )}
              </div>

              {/* Profile Content */}
              <div className="px-6 -mt-16 space-y-6">
                {/* Profile Image */}
                <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                  {formData.profileImage ? (
                    <img
                      src={formData.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Camera className="text-gray-400" size={32} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold">{formData.name}</h3>
                  <p className="text-gray-600">{formData.title}</p>
                  <p className="text-sm text-gray-500">{formData.email}</p>
                  <p className="text-sm text-gray-500">{formData.phone}</p>
                </div>

                {/* Social Icons */}
                {/* <div className="flex justify-center gap-4">
                  {[Linkedin, Facebook, Instagram, Twitter].map((Icon, i) => (
                    <button
                      key={i}
                      className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100"
                    >
                      <Icon size={20} className="text-gray-600" />
                    </button>
                  ))}
                </div> */}

                {/* Links */}
                {/* <div className="space-y-3">
                  {formData.links.map((link, index) => (
                    <button
                      key={index}
                      className="flex items-center justify-between w-full p-3 rounded-lg border hover:bg-gray-50"
                    >
                      <span>{link.title || "Link Title"}</span>
                      <ArrowUpRight size={16} />
                    </button>
                  ))}
                </div> */}

                {/* Save Contact */}
                {/* <button className="w-full p-4 rounded-xl bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-center gap-2">
                  Save Contact
                  <ArrowRight size={18} />
                </button> */}
              </div>
            </div>
          </div>

          {/* <div className="absolute top-24 -right-2 w-2 h-12 bg-gray-800 rounded-l-lg" /> */}
        </div>
      </div>
    </div>
  );
};

export default DigitalCardPreview;
