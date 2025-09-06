"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  ChevronRight,
  Check,
  Plus,
  Trash2,
  Package,
  MapPin,
  CreditCard,
  ChevronDown,
} from "lucide-react";

const FlexgoldConfigurator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState("flyer");
  const [quantity, setQuantity] = useState(250);
  const [orderItems, setOrderItems] = useState([]);
  const [showAddMore, setShowAddMore] = useState(false);
  const [formData, setFormData] = useState({
    billing: {},
    delivery: {},
    sameAsBilling: true,
  });
  const [isQuantityDropdownOpen, setIsQuantityDropdownOpen] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("DE");
  const dropdownRef = useRef(null);
  const countryDropdownRef = useRef(null);

  // Updated products with actual image URLs - replace these with your actual image URLs
  const products = {
    flyer: {
      name: "Flyer",
      price: 0,
      image:
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=200&fit=crop&auto=format",
      alt: "Flyer Design",
    },
    brochure: {
      name: "Broschüre",
      price: 0,
      image:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=200&fit=crop&auto=format",
      alt: "Brochure Design",
    },
    rollup: {
      name: "Roll-Up",
      price: 84.99,
      image:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop&auto=format",
      alt: "Roll-Up Banner",
    },
  };

  const quantities = [50, 100, 250, 500];

  const countries = [
    { code: "DE", name: "Deutschland", flag: "🇩🇪" },
    { code: "AT", name: "Österreich", flag: "🇦🇹" },
    { code: "CH", name: "Schweiz", flag: "🇨🇭" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsQuantityDropdownOpen(false);
      }
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target)
      ) {
        setIsCountryDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Custom Dropdown Component
  const CustomDropdown = ({
    options,
    selectedValue,
    onSelect,
    isOpen,
    setIsOpen,
    placeholder,
    renderOption,
    renderSelected,
    dropdownRef,
  }) => (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 flex items-center justify-between transition-all duration-300 hover:bg-white/15"
      >
        <span>
          {renderSelected ? renderSelected(selectedValue) : selectedValue}
        </span>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800/95 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="max-h-48 overflow-y-auto">
            {options.map((option, index) => (
              <button
                key={option.value || option}
                onClick={() => {
                  onSelect(option.value || option);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-white hover:bg-amber-500/20 transition-colors duration-200 flex items-center gap-3 border-b border-white/10 last:border-b-0"
              >
                {renderOption ? renderOption(option) : option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Fixed addToOrder function
  const addToOrder = () => {
    const product = products[selectedProduct];
    const newItem = {
      id: Date.now(),
      type: selectedProduct,
      name: product.name,
      quantity,
      price: product.price,
    };

    setOrderItems([...orderItems, newItem]);
    setCurrentStep(2);
  };

  const removeItem = (id) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  const getTotalCost = () => {
    return orderItems.reduce((total, item) => total + item.price, 0);
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleFormSubmit = () => {
    setCurrentStep(5);
  };

  const StepIndicator = () => (
    <div className="flex justify-center mb-8">
      {[1, 2, 3, 4, 5].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-3 h-3 rounded-full transition-all duration-500 ${
              step <= currentStep
                ? "bg-gradient-to-r from-amber-400 to-amber-600 scale-110"
                : "bg-gray-600"
            }`}
          />
          {step < 5 && (
            <div
              className={`w-8 h-0.5 transition-all duration-500 ${
                step < currentStep ? "bg-amber-500" : "bg-gray-600"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const ProductCard = ({ type, isSelected, onClick }) => (
    <button
      onClick={onClick}
      className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
        isSelected
          ? "border-amber-400 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20"
          : "border-gray-200 dark:border-gray-700 hover:border-amber-300"
      }`}
    >
      <div className="mb-4 overflow-hidden rounded-xl">
        <img
          src={products[type].image}
          alt={products[type].alt}
          className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            // Fallback to emoji if image fails to load
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "block";
          }}
        />
        <div className="text-3xl text-center py-8 hidden">
          {type === "flyer" ? "📄" : type === "brochure" ? "📖" : "🖼️"}
        </div>
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
        {products[type].name}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {products[type].price > 0 ? `EUR ${products[type].price}` : "Kostenlos"}
      </p>
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
    </button>
  );

  // Hero Image Section - displays the selected product image prominently
  const HeroImageSection = () => (
    <div className="mb-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 p-8">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="lg:w-1/2">
            <img
              src={products[selectedProduct].image}
              alt={products[selectedProduct].alt}
              className="w-full max-w-md mx-auto rounded-2xl shadow-2xl transition-all duration-500"
              onError={(e) => {
                // Fallback display
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div className="hidden w-full max-w-md mx-auto h-64 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-2xl items-center justify-center text-8xl">
              {selectedProduct === "flyer"
                ? "📄"
                : selectedProduct === "brochure"
                  ? "📖"
                  : "🖼️"}
            </div>
          </div>
          <div className="lg:w-1/2 text-center lg:text-left">
            <h3 className="text-3xl font-light mb-4 text-amber-400">
              {products[selectedProduct].name}
            </h3>
            <p className="text-gray-300 text-lg mb-6">
              {selectedProduct === "flyer" &&
                "Professionelle Flyer für Ihre Werbezwecke. Hochwertige Qualität und ansprechendes Design."}
              {selectedProduct === "brochure" &&
                "Informative Broschüren, die Ihre Botschaft perfekt vermitteln. Ideal für detaillierte Produktinformationen."}
              {selectedProduct === "rollup" &&
                "Portable Roll-Up Banner für Messen und Events. Einfach aufzustellen und wieder verwendbar."}
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full text-amber-300">
              <span className="text-2xl font-bold">
                {products[selectedProduct].price > 0
                  ? `EUR ${products[selectedProduct].price}`
                  : "Kostenlos"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AnimatedStep = ({ children, isActive }) => (
    <div
      className={`transition-all duration-500 transform ${
        isActive
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-8 scale-95 pointer-events-none absolute"
      }`}
    >
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <StepIndicator />

          <div className="relative min-h-[600px]">
            {/* Step 1: Product Selection */}
            <AnimatedStep isActive={currentStep === 1}>
              <div className="text-center mb-8">
                <h2 className="text-4xl font-light mb-4 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                  Kostenfreie Werbemittel
                </h2>
                <p className="text-gray-300">
                  Wählen Sie Ihr gewünschtes Werbemittel aus
                </p>
              </div>

              {/* Hero Image Section */}
              <HeroImageSection />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {Object.keys(products).map((type) => (
                  <ProductCard
                    key={type}
                    type={type}
                    isSelected={selectedProduct === type}
                    onClick={() => setSelectedProduct(type)}
                  />
                ))}
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/5 rounded-2xl p-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">
                    Anzahl*
                  </label>
                  <CustomDropdown
                    options={quantities}
                    selectedValue={quantity}
                    onSelect={setQuantity}
                    isOpen={isQuantityDropdownOpen}
                    setIsOpen={setIsQuantityDropdownOpen}
                    renderSelected={(value) => `${value} Stück`}
                    renderOption={(option) => `${option} Stück`}
                    dropdownRef={dropdownRef}
                  />
                </div>

                <button
                  onClick={addToOrder}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Zur Bestellung hinzufügen
                </button>
              </div>
            </AnimatedStep>

            {/* Step 2: Order Confirmation */}
            <AnimatedStep isActive={currentStep === 2}>
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-light mb-4">
                  {products[orderItems[orderItems.length - 1]?.type]?.name}{" "}
                  erfolgreich hinzugefügt!
                </h2>
              </div>

              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Zur Bestellübersicht
                </button>

                <button
                  onClick={() => setShowAddMore(!showAddMore)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Weiteres Werbemittel hinzufügen
                </button>
              </div>

              {showAddMore && (
                <div className="mt-8 bg-white/5 rounded-2xl p-6 animate-fadeIn">
                  <h3 className="text-xl font-semibold mb-4">
                    Weiteres Werbemittel auswählen
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {Object.keys(products)
                      .filter(
                        (type) => !orderItems.some((item) => item.type === type)
                      )
                      .map((type) => (
                        <ProductCard
                          key={type}
                          type={type}
                          isSelected={selectedProduct === type}
                          onClick={() => setSelectedProduct(type)}
                        />
                      ))}
                  </div>
                  <button
                    onClick={addToOrder}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                  >
                    Hinzufügen
                  </button>
                </div>
              )}
            </AnimatedStep>

            {/* Step 3: Order Overview */}
            <AnimatedStep isActive={currentStep === 3}>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-light mb-4 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                  Bestellübersicht
                </h2>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 mb-8">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Package className="w-6 h-6" />
                    Kosten Werbemittel
                  </h3>
                  <div className="space-y-3">
                    {orderItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={products[item.type].image}
                            alt={products[item.type].alt}
                            className="w-12 h-12 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "block";
                            }}
                          />
                          <span className="text-2xl hidden">
                            {item.type === "flyer"
                              ? "📄"
                              : item.type === "brochure"
                                ? "📖"
                                : "🖼️"}
                          </span>
                          <span>
                            {item.name}, allgemein, {item.quantity} Stück
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold">
                            {item.price > 0
                              ? `EUR ${item.price.toFixed(2)}`
                              : "kostenlos"}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/20 pt-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Versand innerhalb Deutschlands
                    </span>
                    <span className="font-semibold">kostenlos</span>
                  </div>
                </div>

                <div className="border-t border-white/20 pt-4">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Kosten gesamt</span>
                    <span className="text-amber-400">
                      EUR {getTotalCost().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={nextStep}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105"
              >
                Jetzt bestellen
              </button>
            </AnimatedStep>

            {/* Step 4: Contact Form */}
            <AnimatedStep isActive={currentStep === 4}>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-light mb-4 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                  Ihre Kontaktdaten
                </h2>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Billing Address */}
                  <div className="bg-white/5 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                      <CreditCard className="w-6 h-6" />
                      Rechnungsadresse
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Vorname"
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Nachname"
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          required
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Firma (optional)"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <div className="grid grid-cols-3 gap-4">
                        <input
                          type="text"
                          placeholder="Straße"
                          className="col-span-2 w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Nr."
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="PLZ"
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Stadt"
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          required
                        />
                      </div>
                      <CustomDropdown
                        options={countries}
                        selectedValue={selectedCountry}
                        onSelect={setSelectedCountry}
                        isOpen={isCountryDropdownOpen}
                        setIsOpen={setIsCountryDropdownOpen}
                        renderSelected={(value) => {
                          const country = countries.find(
                            (c) => c.code === value
                          );
                          return (
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{country?.flag}</span>
                              <span>{country?.name}</span>
                            </div>
                          );
                        }}
                        renderOption={(option) => (
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{option.flag}</span>
                            <span>{option.name}</span>
                          </div>
                        )}
                        dropdownRef={countryDropdownRef}
                      />
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="bg-white/5 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        <MapPin className="w-6 h-6" />
                        Lieferadresse
                      </h3>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.sameAsBilling}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              sameAsBilling: e.target.checked,
                            })
                          }
                          className="rounded"
                        />
                        <span className="text-sm">Wie Rechnungsadresse</span>
                      </label>
                    </div>

                    {!formData.sameAsBilling && (
                      <div className="space-y-4">
                        {/* Same form fields as billing */}
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Vorname"
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                          <input
                            type="text"
                            placeholder="Nachname"
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                        {/* Additional fields... */}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleFormSubmit}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  Bestellung absenden
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </AnimatedStep>

            {/* Step 5: Thank You */}
            <AnimatedStep isActive={currentStep === 5}>
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                  <Check className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-4xl font-light mb-4 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                  Vielen Dank!
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Ihre Bestellung wurde erfolgreich übermittelt!
                </p>
                <p className="text-gray-400">
                  Wir werden uns in Kürze mit Ihnen in Verbindung setzen.
                </p>
              </div>
            </AnimatedStep>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FlexgoldConfigurator;
