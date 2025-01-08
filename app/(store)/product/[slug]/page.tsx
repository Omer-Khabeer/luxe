import { notFound } from "next/navigation";
import { getProductBySlug } from "@/sanity/lib/products/getProductBySlug";

async function ProductPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return notFound();
  }

  return <div>hello World</div>;
}

export default ProductPage;
