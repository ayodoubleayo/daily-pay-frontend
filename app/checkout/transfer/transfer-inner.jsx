"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CartContext } from "../../../context/CartContext";

export default function TransferPageInner() {
  const router = useRouter();
  const search = useSearchParams();
  const { clearCart } = useContext(CartContext);

  const [bank, setBank] = useState(null);
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [paymentProof, setPaymentProof] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const sellerId = search.get("seller");
  const orderId = search.get("order");
  const txIdParam = search.get("tx"); // possible transaction id passed from checkout
  const amountParam = search.get("amount");
  const amount = amountParam ? Number(amountParam) : null;

  const [txId, setTxId] = useState(txIdParam || null);

  // allow hydration
  useEffect(() => { setReady(true); }, []);

  // load token + user
  useEffect(() => {
    if (!ready) return;
    const tk = localStorage.getItem("token");
    const usr = localStorage.getItem("user");
    if (tk && usr) {
      setToken(tk);
      try { setUser(JSON.parse(usr)); } catch { setUser(null); }
    }
  }, [ready]);

  // load bank details
  useEffect(() => {
    if (!ready) return;

    async function loadSellerBank() {
      try {
        if (sellerId) {
          const sellerRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sellers/${sellerId}`);
          if (sellerRes.ok) {
            const seller = await sellerRes.json();
            if (seller.bank && seller.bank.accountNumber) {
              setBank({
                bankName: seller.bank.bankName,
                accountName: seller.bank.accountName,
                accountNumber: seller.bank.accountNumber,
                instructions: seller.bank.instructions || "",
              });
              return;
            }
          }
        }

        const platformRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bank-details`);
        if (platformRes.ok) {
          const pb = await platformRes.json();
          setBank({
            bankName: pb.bankName || "",
            accountName: pb.accountName || "",
            accountNumber: pb.accountNumber || "",
            instructions: pb.instructions || "",
          });
        }
      } catch (err) {
        console.error("BANK LOAD ERROR: ", err);
      }
    }

    loadSellerBank();
  }, [ready, sellerId]);

  // If txId not provided, try to find the transaction for the order
  useEffect(() => {
    if (!ready) return;

    // if tx is already set from query, nothing to do
    if (txId) return;

    // attempt to locate transaction by orderId via user transactions endpoint
    async function findTxByOrder() {
      if (!orderId) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions/user/me`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) return;
        const txs = await res.json();
        if (!Array.isArray(txs)) return;
        const found = txs.find(t => {
          if (!t) return false;
          // orderId might be object or id string
          const tOrderId = (t.orderId && (t.orderId._id || t.orderId)) || t.orderId;
          return String(tOrderId) === String(orderId) || (t.orderId && String(t.orderId) === String(orderId));
        });
        if (found && found._id) {
          setTxId(found._id);
        }
      } catch (err) {
        console.warn("Could not find transaction by order", err);
      }
    }

    findTxByOrder();
  }, [ready, orderId, txId, token]);

  // UPLOAD screenshot
  async function uploadProof(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });

      const text = await res.text();
      let data = {};
      try { data = text ? JSON.parse(text) : {}; } catch { data = {}; }

      if (!res.ok) throw new Error(data.error || "Upload failed");

      setPaymentProof(data.url);
      alert("Payment proof uploaded!");
    } catch (err) {
      console.error("uploadProof error", err);
      alert(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function submitOrder() {
    if (!paymentProof) return alert("Upload payment proof first!");
    if (!token) return alert("Please login to finalize order");

    setLoading(true);

    try {
      // prefer txId param or discovered txId
      if (!txId) {
        throw new Error("Missing transaction ID. Checkout must provide ?tx=... or a matching transaction must exist for this order.");
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions/${txId}/proof`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ proofUrl: paymentProof }),
      });

      const text = await res.text();
      let j = {};
      try { j = text ? JSON.parse(text) : {}; } catch {}

      if (!res.ok) {
        throw new Error(j.error || j.message || text || "Failed to submit proof");
      }

      clearCart();
      // redirect to success screen including order id if we have it
      router.push(orderId ? `/checkout/success?order=${orderId}` : "/checkout/success");
    } catch (err) {
      console.error("submitOrder error:", err);
      alert(err.message || "Could not submit proof");
    } finally {
      setLoading(false);
    }
  }

  if (!ready || !bank) return null;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">Transfer Payment</h1>

      <p className="text-sm mb-4">Please make payment using the bank details below:</p>

      <div className="p-4 border rounded mb-4">
        <p><strong>Bank:</strong> {bank.bankName}</p>
        <p><strong>Account Name:</strong> {bank.accountName}</p>
        <p><strong>Account Number:</strong> {bank.accountNumber}</p>

        {bank.instructions && (
          <p className="mt-2 text-sm text-gray-600">{bank.instructions}</p>
        )}
      </div>

      <p className="font-semibold mb-4">
        Amount to Pay: ₦{amount ? amount.toLocaleString() : "—"}
      </p>

      <div className="mb-4">
        <label className="text-sm">Upload Payment Screenshot:</label>
        <input
          type="file"
          onChange={uploadProof}
          className="mt-1 w-full border rounded p-2"
        />
        {uploading && <p className="text-blue-600 text-sm">Uploading…</p>}
        {paymentProof && <p className="text-green-600 text-sm">Uploaded ✓</p>}
      </div>

      <button
        onClick={submitOrder}
        disabled={loading}
        className="w-full py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Processing…" : "I Have Paid — Submit Order"}
      </button>
    </div>
  );
}
