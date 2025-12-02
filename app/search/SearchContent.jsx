"use client";

import { useSearchParams } from "next/navigation";

export default function SearchContent() {
  const search = useSearchParams();
  const q = search.get("q") || "";

  // your old search code here
  return (
    <div>
      <h1>Search Results for: {q}</h1>
      {/* your UI */}
    </div>
  );
}
