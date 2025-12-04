import AddToCartButton from "../../../components/AddToCartButton";
import { notFound } from "next/navigation";
import React from "react";

// Fetch product by ID
async function getProduct(id) {
    console.log("SERVER  FETCHING PRODUCT WITH ID:", id);

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
        { cache: "no-store" }
    );

    console.log("SERVER  RESPONSE STATUS:", res.status);

    if (!res.ok) return null;
    return res.json();
}

// Seller Badge
const SellerBadge = ({ seller }) => (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-4 shadow-sm mt-4">
        <img
            src={seller.shopLogo || "/placeholder.png"}
            alt={seller.shopName || seller.name || "Seller"}
            className="w-12 h-12 rounded-full object-cover border-2 border-green-500 p-0.5"
        />
        <div className="text-sm flex-grow">
            <div className="font-bold text-base text-gray-900">
                {seller.shopName || seller.name}
            </div>
            <div className="text-xs text-gray-500">
                {seller.shopDescription || "Verified Marketplace Seller"}
            </div>

            {seller.address && (
                <div className="text-xs text-gray-600 mt-1 flex items-center">
                    <svg
                        className="w-3 h-3 mr-1 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        ></path>
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                    </svg>
                    {seller.address}
                </div>
            )}
        </div>
    </div>
);

// ✅ FIXED VERSION — Next.js 15+ requires awaiting params
export default async function ProductPage(props) {
    const params = await props.params;

    console.log("PAGE PARAMS:", params);
    console.log("PRODUCT ID:", params.id);

    const id = params.id;
    const product = await getProduct(id);

    console.log("FINAL PRODUCT:", product);

    if (!product) return notFound();

    const stockStatus =
        product.stock > 10
            ? "In Stock"
            : product.stock > 0
            ? `Low Stock (${product.stock} left)`
            : "Out of Stock";

    const stockColor =
        product.stock > 10
            ? "text-green-600 bg-green-100"
            : product.stock > 0
            ? "text-yellow-600 bg-yellow-100"
            : "text-red-600 bg-red-100";

    return (
        <div className="max-w-6xl mx-auto mt-8 p-4 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                
                {/* LEFT SIDE */}
                <div className="p-4 md:p-8">
                    <img
                        src={product.image || "/placeholder.png"}
                        className="w-full h-[400px] object-cover rounded-xl shadow-xl"
                        alt={product.name}
                    />

                    {product.seller && <SellerBadge seller={product.seller} />}
                </div>

                {/* RIGHT SIDE */}
                <div className="p-4 md:p-8 flex flex-col justify-start">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
                        {product.name}
                    </h1>

                    {product.stock !== undefined && (
                        <p className={`mt-3 px-3 py-1 text-sm font-semibold rounded-full w-fit ${stockColor}`}>
                            {stockStatus}
                        </p>
                    )}

                    <div className="mt-6 border-y border-gray-200 py-4">
                        <p className="text-sm text-gray-500">Retail Price:</p>
                        <p className="text-4xl font-bold text-blue-600">
                            ₦{Number(product.price).toLocaleString()}
                        </p>
                    </div>

                    <p className="mt-6 text-gray-700 leading-relaxed text-base">
                        {product.description}
                    </p>

                    <div className="mt-10 pt-4 border-t border-gray-100">
                        <AddToCartButton product={product} />
                    </div>
                </div>
            </div>
        </div>
    );
}
