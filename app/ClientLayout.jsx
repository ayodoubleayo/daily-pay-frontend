"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MobileBottomBar from "../components/MobileBottomBar";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";

export default function ClientLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <CartProvider>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-transparent">

          {/* NAVBAR */}
          <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

          {/* MAIN CONTENT */}
          <main className="flex-1 max-w-5xl mx-auto p-4 pb-24">
            {children}
          </main>

          {/* FOOTER – only visible when menu is closed */}
          {!menuOpen && (
            <div className="hidden md:block">
              <Footer />
            </div>
          )}

          {/* MOBILE BOTTOM BAR – hides when menuOpen === true */}
          <div className={`md:hidden ${menuOpen ? "hidden" : "block"}`}>
            <MobileBottomBar onOpenMenu={() => setMenuOpen(true)} />
          </div>
        </div>
      </AuthProvider>
    </CartProvider>
  );
}
