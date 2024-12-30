import { Button } from "@/components/ui/button";
import { getAllCategories } from "@/sanity/lib/categories/getAllCategories";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";
import Image from "next/image";
import ProductsView from "@/components/ProductsView";

export default async function Home() {
  const products = await getAllProducts();
  const categories = await getAllCategories();

  return (
    <div>
      <div>
        <ProductsView products={products} categories={categories} />
      </div>
    </div>
  );
}
