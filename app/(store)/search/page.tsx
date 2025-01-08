import ProductGrid from "@/components/ProductGrid";
import { searchProductsByName } from "@/sanity/lib/products/searchProductsByName";

interface PageProps {
  params: { slug: string };
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  // Await the searchParams
  const params = await searchParams;
  const query = typeof params.query === "string" ? params.query : "";

  const products = await searchProductsByName(query);

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl text-center">
          <h1 className="text-2xl font-bold mb-4">
            No Results Found For: {query}
          </h1>
          <p className="text-gray-600">
            We couldn't find any products matching your search query.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-4">
          Search Results for "{query}"
        </h1>
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
