"use client";

import Link from "next/link";
import { useContext } from "react";
import { CartContext } from "@/context/CartContext";

export default function MobileBottomBar({ onOpenMenu }) {
  const { cart } = useContext(CartContext);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg z-[9999] flex justify-around items-center py-2 md:hidden">

      {/* Home */}
      <Link href="/" className="flex flex-col items-center text-center">
        <span className="text-xl">🏠</span>
        <span className="text-xs">Home</span>
      </Link>

      {/* Cart */}
      <Link href="/cart" className="relative flex flex-col items-center text-center">
        <span className="text-xl">🛒</span>
        <span className="text-xs">Cart</span>

        {cart?.length > 0 && (
          <span className="absolute -top-2 -right-3 bg-blue-700 text-white text-xs px-2 py-0.5 rounded-full">
            {cart.length}
          </span>
        )}
      </Link>

      {/* Menu */}
      <button
        onClick={onOpenMenu}
        className="flex flex-col items-center text-center"
      >
        <span className="text-xl">☰</span>
        <span className="text-xs">Menu</span>
      </button>
    </div>
  );
}
