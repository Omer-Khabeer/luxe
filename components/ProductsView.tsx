import { Category, Product } from "@/sanity.types";

interface ProductsViewProps {
  products: Product[];
  categories: Category[];
}

const ProductsView = ({ products }: ProductsViewProps) => {
  return (
    <div className="flex flex-col">
      {/* Categories */}
      <div className="w-full sm:w-[200px]">
        <CategorySelectorComponent categories={categories} />
      </div>
      {/* Products */}
      <div className="flex-1">
        <div>{/* <ProductGrid  products={products}/> */}</div>
        <hr className="w-1/2 sm:w-3/4" />
      </div>
    </div>
  );
};

export default ProductsView;