"use client";

import { Suspense } from "react";
import ChargeAnimation from "../../../../components/ChargeAnimation";
import { useSearchParams } from "next/navigation";

function ReleaseAnimationContent() {
  const sp = useSearchParams();
  const amount = Number(sp.get("amount") || 0);
  const percent = Number(sp.get("percent") || 10);

  return (
    <div className="max-w-md mx-auto mt-12">
      <ChargeAnimation total={amount} percent={percent} />
    </div>
  );
}

export default function ReleaseAnimationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReleaseAnimationContent />
    </Suspense>
  );
}
