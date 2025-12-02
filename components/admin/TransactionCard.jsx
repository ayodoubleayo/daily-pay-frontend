"use client";

import React from "react";

/**
 * TransactionCard Component
 * - Reusable for Seller and User history pages
 * - Displays transaction status, amount, date, and items
 */
export default function TransactionCard({ tx }) {
  if (!tx) return null;

  const {
    _id,
    status,
    totalAmount,
    items = [],
    createdAt,
    paymentMethod,
  } = tx;

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleString();
    } catch {
      return "Invalid date";
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "pending_admin_approval":
        return "bg-yellow-500 text-black";
      case "pending_seller_payout":
        return "bg-blue-600 text-white";
      case "completed":
        return "bg-green-600 text-white";
      case "cancelled":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="border p-4 rounded-xl shadow bg-white">
      {/* Status + Amount */}
      <div className="flex justify-between items-center mb-3">
        <span
          className={`px-3 py-1 rounded-lg text-sm font-semibold ${statusColor(
            status
          )}`}
        >
          {status.replace(/_/g, " ").toUpperCase()}
        </span>

        <span className="text-lg font-bold text-gray-900">
          ₦{Number(totalAmount).toLocaleString()}
        </span>
      </div>

      {/* Items list */}
      <div className="mb-3">
        <p className="font-semibold text-gray-800">Items:</p>
        <ul className="list-disc ml-5 text-gray-700 text-sm">
          {items.map((item, i) => (
            <li key={i}>
              {item?.name || "Unnamed item"} × {item?.quantity || 1}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer info */}
      <div className="text-sm text-gray-600 mt-4">
        <p><strong>ID:</strong> {String(_id)}</p>
        <p><strong>Payment:</strong> {paymentMethod || "not specified"}</p>
        <p><strong>Date:</strong> {formatDate(createdAt)}</p>
      </div>
    </div>
  );
}
