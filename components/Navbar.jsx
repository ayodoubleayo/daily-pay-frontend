"use client";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";

export default function Navbar({ menuOpen, setMenuOpen }) {
  const { cart } = useContext(CartContext);
  const [mounted, setMounted] = useState(false);

  const [userDropdown, setUserDropdown] = useState(false);
  const [sellerDropdown, setSellerDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    setMounted(true);

    try {
      const data =
        typeof window !== "undefined" ? localStorage.getItem("user") : null;
      const adminFlag =
        typeof window !== "undefined"
          ? localStorage.getItem("isAdminUser")
          : null;

      if (data) setUser(JSON.parse(data));
      if (adminFlag === "true") setIsAdminUser(true);
    } catch (e) {
      console.warn("Navbar localStorage read failed", e);
    }
  }, []);

  function closeMenu() {
    setMenuOpen(false);
    setUserDropdown(false);
    setSellerDropdown(false);
  }

  function handleLogout() {
    if (typeof window !== "undefined") {
      localStorage.clear();
      window.location.href = "/login";
    }
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
        
        {/* LOGO */}
        <Link
          href="/"
          onClick={closeMenu}
          className="whitespace-nowrap text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent mr-10 md:mr-20"
        >
          DAILY-PAY MARKETPLACE
        </Link>

        {/* MOBILE HAMBURGER */}
        <button
          className="md:hidden text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* MAIN NAV */}
        <div
          className={`
            flex flex-col md:flex-row md:items-center gap-5
            absolute md:static bg-white left-0 right-0 
            top-16 md:top-auto p-5 md:p-0
            transition-all duration-300 shadow-md md:shadow-none

            ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible md:opacity-100 md:visible"}

            max-h-[80vh] overflow-y-auto    /* <-- scrollable on mobile */
          `}
        >
          {/* SEARCH BAR */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const q = e.target.searchInput.value.trim();
              if (q.length > 0)
                window.location.href = `/search?q=${encodeURIComponent(q)}`;
              closeMenu();
            }}
            className="flex items-center bg-gray-100 px-3 py-1 rounded-full w-full md:w-auto"
          >
            <input
              type="text"
              name="searchInput"
              placeholder="Search products..."
              className="bg-transparent outline-none px-2 text-sm w-full md:w-40"
            />
            <button type="submit" className="text-blue-700 font-semibold">
              🔍
            </button>
          </form>

          {/* STATIC LINKS */}
          <Link href="/" onClick={closeMenu}>Home</Link>
          <Link href="/categories" onClick={closeMenu}>Categories</Link>
          <Link href="/products" onClick={closeMenu}>Products</Link>

          {/* CART BUTTON */}
          <Link
            href={user ? "/cart" : "/login"}
            onClick={closeMenu}
            className="relative flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25h9.75m-9.75 0l-1.125 4.5m1.125-4.5L5.106 5.272A1.125 1.125 0 014.002 4.5H3m13.5 9.75l1.125 4.5m-1.125-4.5h2.419c.51 0 .955-.343 1.087-.835l1.681-6.301A1.125 1.125 0 0020.719 6H5.25"
              />
            </svg>

            {mounted && cart?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-700 text-white text-xs px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            )}
          </Link>

          <Link href="/about" onClick={closeMenu}>About</Link>
          <Link href="/suggestions" onClick={closeMenu}>Suggestion</Link>
          <Link href="/complaints" onClick={closeMenu}>Complaint</Link>

          {/* NOT LOGGED IN */}
          {!user && (
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3">

              {/* USER DROPDOWN */}
              <div className="relative md:static w-full md:w-auto">
                <button
                  onClick={() => {
                    setUserDropdown(!userDropdown);
                    setSellerDropdown(false);
                    setMenuOpen(true); // <-- hides bottom bar
                  }}
                  className="text-blue-600 text-sm whitespace-nowrap"
                >
                  ⭐ User / Want to hire? ⬇
                </button>

                {userDropdown && (
                  <div className="md:absolute bg-white shadow-md p-3 rounded w-full md:w-40 flex flex-col gap-2 z-50 mt-2 md:mt-0">
                    <Link href="/register" onClick={closeMenu}>User Register</Link>
                    <Link href="/login" onClick={closeMenu}>User Login</Link>
                  </div>
                )}
              </div>

              {/* SELLER DROPDOWN */}
              <div className="relative md:static w-full md:w-auto">
                <button
                  onClick={() => {
                    setSellerDropdown(!sellerDropdown);
                    setUserDropdown(false);
                    setMenuOpen(true); // <-- hides bottom bar
                  }}
                  className="text-purple-600 text-sm whitespace-nowrap"
                >
                  Seller / ready to work? ⬇
                </button>

                {sellerDropdown && (
                  <div className="md:absolute bg-white shadow-md p-3 rounded w-full md:w-40 flex flex-col gap-2 z-50 mt-2 md:mt-0">
                    <Link href="/seller/register" onClick={closeMenu}>Seller Register</Link>
                    <Link href="/seller/login" onClick={closeMenu}>Seller Login</Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* LOGGED IN */}
          {user && (
            <div className="flex flex-col md:flex-row gap-4 md:gap-5">
              <span className="font-semibold">Hi, {user.name}</span>

              <Link href="/account" onClick={closeMenu}>My Account</Link>

              <Link href="/user/history" className="text-blue-600" onClick={closeMenu}>
                My History
              </Link>

              {isAdminUser && (
                <Link href="/admin/dashboard" className="text-red-600 font-bold" onClick={closeMenu}>
                  Admin Panel
                </Link>
              )}

              <button onClick={handleLogout} className="text-red-600">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
