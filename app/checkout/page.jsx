"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { CartContext } from "../../context/CartContext";

export default function CheckoutPage() {
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState({ name: "", address: "", city: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [paymentProof, setPaymentProof] = useState("");
  const [shippingMethod, setShippingMethod] = useState("pickup");
  const [fees, setFees] = useState({ pickupFee: 0, deliveryFee: 0 });
  const [estimatedMinutes, setEstimatedMinutes] = useState(0);

  const router = useRouter();
  const { cart, clearCart } = useContext(CartContext);

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const tk = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const usr = typeof window !== "undefined" ? localStorage.getItem("user") : null;

    if (!tk || !usr) {
      alert("Please login to continue checkout");
      router.push("/login");
      return;
    }

    setToken(tk);
    try {
      setUser(JSON.parse(usr));
    } catch {
      setUser(null);
    }

    fetchFees();
  }, [ready]);

  async function fetchFees() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/public`);
      if (!res.ok) return;

      const data = await res.json();
      setFees({
        pickupFee: Number(data.pickupFee ?? 0),
        deliveryFee: Number(data.deliveryFee ?? 0),
      });
    } catch {}
  }

  const subtotal = cart.reduce((s, it) => s + Number(it.price || 0) * (it.qty || 1), 0);
  const chosenFee = shippingMethod === "delivery" ? fees.deliveryFee : fees.pickupFee;
  const total = Math.round(subtotal + chosenFee);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!token) return alert("You must login before checkout.");
    if (cart.length === 0) return alert("Cart is empty");

    setLoading(true);

    try {
      const items = cart.map((it) => ({
        productId: it._id,
        name: it.name,
        price: Number(it.price || 0),
        qty: it.qty || 1,
      }));

      const first = cart[0];
      let sellerId =
        first?.seller?._id ||
        first?.sellerId ||
        first?.seller ||
        null;

      const shipping = {
        method: shippingMethod,
        fee: chosenFee,
        details: {
          name: form.name,
          phone: form.phone,
          address: form.address,
          city: form.city,
        },
      };

      const body = {
        orderType: "product",
        buyerId: user?.id || user?._id || null,
        sellerId,
        items,
        meta: { shipping },
        paymentMock: true,
        paymentProof,
        total,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Order failed");

      clearCart();

      router.push(`/checkout/transfer?amount=${total}`);
    } catch (err) {
      alert(err.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  if (!ready) return null;

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
          <div>
            <label className="block text-sm">Full name</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full border mt-1 p-2 rounded" required />
          </div>

          <div>
            <label className="block text-sm">Address</label>
            <input name="address" value={form.address} onChange={handleChange} className="w-full border mt-1 p-2 rounded" required />
          </div>

          <div>
            <label className="block text-sm">City</label>
            <input name="city" value={form.city} onChange={handleChange} className="w-full border mt-1 p-2 rounded" required />
          </div>

          <div>
            <label className="block text-sm">Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} className="w-full border mt-1 p-2 rounded" required />
          </div>

          <div className="pt-2">
            <label className="block text-sm mb-2">Shipping Method</label>

            <label className="flex items-center gap-2">
              <input type="radio" value="pickup" checked={shippingMethod === "pickup"} onChange={() => setShippingMethod("pickup")} />
              <span>Pickup (₦{fees.pickupFee.toLocaleString()})</span>
            </label>

            <label className="flex items-center gap-2 mt-1">
              <input type="radio" value="delivery" checked={shippingMethod === "delivery"} onChange={() => setShippingMethod("delivery")} />
              <span>Delivery (₦{fees.deliveryFee.toLocaleString()})</span>
            </label>
          </div>

          <button disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded mt-4">
            {loading ? "Processing…" : "Place Order"}
          </button>
        </form>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>

          {cart.map((item) => (
            <div key={item._id} className="flex justify-between mb-2">
              <span>{item.name} × {item.qty}</span>
              <span>₦{(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}

          <hr className="my-3" />

          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>₦{total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
