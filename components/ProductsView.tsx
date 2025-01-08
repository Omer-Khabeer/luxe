"use client";
import { Category, Product } from "@/sanity.types";
import ProductGrid from "./ProductGrid";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

interface ProductsViewProps {
  products: Product[];
  categories: Category[];
}

const ProductsView = ({ products, categories }: ProductsViewProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filteredProducts = selectedCategory
    ? products.filter((product) =>
        product.categories?.some((cat) => cat._id === selectedCategory)
      )
    : products;

  const CategorySelector = () => (
    <div className="space-y-2">
      <Button
        variant="ghost"
        className={`w-full justify-start text-left ${
          !selectedCategory ? "bg-blue-50 text-blue-700" : ""
        }`}
        onClick={() => setSelectedCategory(null)}
      >
        All Products
      </Button>
      {categories.map((category) => (
        <Button
          key={category._id}
          variant="ghost"
          className={`w-full justify-start text-left ${
            selectedCategory === category._id ? "bg-blue-50 text-blue-700" : ""
          }`}
          onClick={() => setSelectedCategory(category._id)}
        >
          {category.title}
        </Button>
      ))}
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Categories - Mobile Drawer */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden">
            <div className="absolute right-0 top-0 h-full w-64 bg-white p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileFilterOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <CategorySelector />
            </div>
          </div>
        )}

        {/* Categories - Desktop Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-4 bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            <CategorySelector />
          </div>
        </div>

        {/* Products Section */}
        <div className="flex-1">
          {/* Products Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedCategory
                  ? categories.find((cat) => cat._id === selectedCategory)
                      ?.title
                  : "All Products"}
              </h1>
              <p className="text-gray-600">
                {filteredProducts.length} products
              </p>
            </div>
          </div>

          {/* Products Grid */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <ProductGrid products={filteredProducts} />
          </div>

          {/* Pagination or Load More (optional) */}
          {filteredProducts.length > 0 && (
            <div className="mt-8 flex justify-center">
              <Button variant="outline" className="w-full max-w-xs">
                Load More
              </Button>
            </div>
          )}

          {/* No Products Message */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">
                No products found in this category.
              </p>
              <Button
                variant="link"
                className="mt-2"
                onClick={() => setSelectedCategory(null)}
              >
                View all products
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsView;
