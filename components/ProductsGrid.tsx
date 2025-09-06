import ProductCard from "./ProductCard";

interface ProductsGridProps {
  title: string;
  products: any[];
  showAllButton?: boolean;
}

const ProductsGrid = ({
  title,
  products,
  showAllButton = false,
}: ProductsGridProps) => {
  return (
    <section className="py-20 bg-amber-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold text-white">{title}</h2>
          {showAllButton && (
            <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors">
              Alle Produkte Anzeigen
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsGrid;
