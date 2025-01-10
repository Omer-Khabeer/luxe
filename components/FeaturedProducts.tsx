// components/FeaturedProducts.tsx
import ProductsView from "@/components/ProductsView";

interface FeaturedProductsProps {
  products: any[];
  categories: any[];
}

export default function FeaturedProducts({
  products,
  categories,
}: FeaturedProductsProps) {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold">
            Our{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              digital
            </span>{" "}
            NFC Cards
          </h2>
        </div>
        <ProductsView products={products} categories={categories} />
      </div>
    </section>
  );
}
