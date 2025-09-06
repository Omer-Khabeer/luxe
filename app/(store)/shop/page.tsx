import ShopPage from "@/components/ShopPage";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";

export default async function Shop() {
  const products = await getAllProducts();
  const categories = await getAllCategories();

  return <ShopPage products={products || []} categories={categories || []} />;
}
