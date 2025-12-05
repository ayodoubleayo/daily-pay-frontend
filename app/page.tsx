// app/page.jsx
import Categories from "../components/Categories";

export default async function Home() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
    { cache: "no-store" }
  );
  const categories = res.ok ? await res.json() : [];

  return (
    <div
      className="
        mt-5 max-w-4xl mx-auto text-white p-5 rounded-xl
        lg:p-10
      "
      style={{
        backgroundImage: "url('/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "400px",
        opacity: "0.95",
      }}
    >
      {/* MAIN TITLE */}
      <h1 className="
        text-3xl font-bold mb-4 text-center
        sm:text-4xl
      ">
        DAILY-PAY MARKETPLACE
      </h1>

      {/* DESCRIPTION */}
      <p className="mb-6 text-base sm:text-lg leading-relaxed text-center">
        Welcome to DAILY-PAY — your all-in-one marketplace for quality products
        and trusted services. Shop items, hire professionals, or offer your
        skills in a safe and reliable environment.
      </p>

      <p className="mb-6 text-base sm:text-lg text-center">
        Your perfect shopping & hiring experience begins here.
      </p>

      <p className="mb-8 text-sm sm:text-base text-center">
        Browse categories and discover products & services near you.
      </p>

      {/* BUTTON */}
      <div className="flex justify-center">
        <a
          href="/products"
          className="
            px-5 py-2.5 sm:px-6 sm:py-3
            bg-blue-700 text-white font-medium
            rounded-lg shadow-md
            hover:bg-blue-800 transition
          "
        >
          Browse All Products
        </a>
      </div>
    </div>
  );
}
