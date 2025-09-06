"use client";
import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import ProductCard from "@/components/ProductCard";

interface ShopPageProps {
  products: any[];
  categories: any[];
}

const ShopPage = ({ products, categories }: ShopPageProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50 });
  const [sortBy, setSortBy] = useState("name");
  const [showFilters, setShowFilters] = useState(false);

  // Calculate actual price range from default pricing
  const actualPriceRange = useMemo(() => {
    return { min: 5, max: 25 };
  }, []);

  // Initialize price range on mount
  useEffect(() => {
    setPriceRange(actualPriceRange);
  }, [actualPriceRange]);

  // Simple filtering - just search and category
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    let filtered = products.filter((product) => {
      // Search filter
      const matchesSearch =
        !searchTerm ||
        product.name?.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter - simplified
      const matchesCategory =
        selectedCategory === "all" ||
        product.category?.slug?.current === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "price-low":
        case "price-high":
          // Let ProductCard handle pricing logic
          return 0;
        case "newest":
          return (
            new Date(b._createdAt || 0).getTime() -
            new Date(a._createdAt || 0).getTime()
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy]);

  console.log("Products received:", products?.length || 0);
  console.log("Filtered products:", filteredProducts.length);

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Hero Section */}
      <section className="bg-amber-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Unser Shop</h1>
          <p className="text-xl text-amber-100">
            Entdecken Sie unsere komplette Auswahl an hochwertigen Nüssen und
            Trockenfrüchten
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Simplified Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Produkte suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            >
              <option value="all">Alle Kategorien</option>
              {categories?.map((category) => (
                <option key={category._id} value={category.slug?.current}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            >
              <option value="name">Name A-Z</option>
              <option value="newest">Neueste zuerst</option>
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-amber-600">
            {filteredProducts.length} von {products?.length || 0} Produkten
            {searchTerm && ` für "${searchTerm}"`}
          </p>

          {(searchTerm || selectedCategory !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="text-amber-600 hover:text-amber-800 underline"
            >
              Filter zurücksetzen
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-amber-900 mb-2">
              Keine Produkte gefunden
            </h2>
            <p className="text-amber-600 mb-6">
              Versuchen Sie andere Suchbegriffe oder Filter
            </p>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-amber-900 mb-2">
              Keine Produkte verfügbar
            </h2>
            <p className="text-amber-600">
              Produkte werden geladen oder sind noch nicht verfügbar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
