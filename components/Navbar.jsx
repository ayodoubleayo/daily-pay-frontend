"use client";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";

export default function Navbar() {
  const { cart } = useContext(CartContext);
  const [mounted, setMounted] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
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

  function handleLogout() {
    if (typeof window !== "undefined") {
      localStorage.clear();
      window.location.href = "/login";
    }
  }

  // 🔥 AUTO-CLOSE MENU & DROPDOWNS ON LINK CLICK
  function closeMenu() {
    setMenuOpen(false);
    setUserDropdown(false);
    setSellerDropdown(false);
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
        <Link
          href="/"
          onClick={closeMenu}
          className="whitespace-nowrap text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent mr-10 md:mr-20"
        >
          $DAILY-PAY
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
            ${
              menuOpen
                ? "opacity-100 visible"
                : "opacity-0 invisible md:opacity-100 md:visible"
            }
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
          <Link href="/" onClick={closeMenu}>
            Home
          </Link>

          <Link href="/categories" onClick={closeMenu}>
            Categories
          </Link>

          <Link href="/products" onClick={closeMenu}>
            Products
          </Link>

          {/* CART */}
          <Link
            href={user ? "/cart" : "/login"}
            className="relative"
            onClick={closeMenu}
          >
            Cart
            {mounted && cart && cart.length > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs bg-blue-700 text-white rounded-full">
                {cart.length}
              </span>
            )}
          </Link>

          <Link href="/about" onClick={closeMenu}>
            About
          </Link>

          <Link href="/suggestions" onClick={closeMenu}>
            Suggestion
          </Link>

          <Link href="/complaints" onClick={closeMenu}>
            Complaint
          </Link>

          {/* IF NOT LOGGED IN */}
          {!user && (
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3">
              {/* USER DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => {
                    setUserDropdown(!userDropdown);
                    setSellerDropdown(false);
                  }}
                  className="text-blue-600 text-sm whitespace-nowrap"
                >
                  ⭐ User / Want to hire? ⬇
                </button>

                {userDropdown && (
                  <div className="absolute bg-white shadow-md p-3 rounded w-40 flex flex-col gap-2 z-50">
                    <Link href="/register" onClick={closeMenu}>
                      User Register
                    </Link>
                    <Link href="/login" onClick={closeMenu}>
                      User Login
                    </Link>
                  </div>
                )}
              </div>

              {/* SELLER DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => {
                    setSellerDropdown(!sellerDropdown);
                    setUserDropdown(false);
                  }}
                  className="text-purple-600 text-sm whitespace-nowrap"
                >
                  Seller / ready to work? ⬇
                </button>

                {sellerDropdown && (
                  <div className="absolute bg-white shadow-md p-3 rounded w-40 flex flex-col gap-2 z-50">
                    <Link href="/seller/register" onClick={closeMenu}>
                      Seller Register
                    </Link>
                    <Link href="/seller/login" onClick={closeMenu}>
                      Seller Login
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* IF LOGGED IN */}
          {user && (
            <div className="flex flex-col md:flex-row gap-4 md:gap-5">
              <span className="font-semibold">Hi, {user.name}</span>

              <Link href="/account" onClick={closeMenu}>
                My Account
              </Link>

              <Link href="/user/history" className="text-blue-600" onClick={closeMenu}>
                My History
              </Link>

              {isAdminUser && (
                <Link
                  href="/admin/dashboard"
                  onClick={closeMenu}
                  className="text-red-600 font-bold"
                >
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
