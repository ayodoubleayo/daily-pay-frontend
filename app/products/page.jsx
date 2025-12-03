export const dynamic = "force-dynamic";

import ProductCard from "../../components/ProductCard";

async function getProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, { 
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

const ProductSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg animate-pulse p-4 h-80 border border-gray-100">
    <div className="w-full h-40 bg-gray-200 rounded-lg"></div>
    <div className="mt-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-6 bg-blue-100 rounded w-full"></div>
    </div>
  </div>
);

export default async function ProductsPage() {
  let products = [];
  let error = null;

  try {
    products = await getProducts();
  } catch (e) {
    console.error("Failed to fetch products:", e);
    error = "Could not load products at this time. Please try again.";
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <header className="pb-6 border-b border-gray-200 mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">Featured Products</h1>
        <p className="mt-2 text-lg text-gray-500">
          Browse our latest and most popular items available on the marketplace.
        </p>
      </header>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error!</strong>
          <span className="ml-2">{error}</span>
        </div>
      )}

      {products.length === 0 && !error ? (
        <div className="text-gray-600 text-center py-10">
          <p className="text-xl font-medium">No products available yet.</p>
          <p className="text-sm mt-2">Check back soon for new listings!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p._id || p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
