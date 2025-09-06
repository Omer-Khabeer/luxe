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
    <section className="py-20 bg-amber-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12 text-center">
          <h2 className="text-4xl font-bold text-center text-amber-900 mb-4">
            Unsere Auswahl
          </h2>
        </div>

        <ProductsView products={products} />
      </div>
    </section>
  );
}
