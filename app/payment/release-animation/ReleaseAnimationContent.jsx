"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ChargeAnimation from "@/components/ChargeAnimation";

function InnerContent() {
  const sp = useSearchParams();

  const amount = Number(sp.get("amount") || 100000);
  const percent = Number(sp.get("percent") || 10);

  const handleRelease = async (amountToRelease) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { success: true };
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <ChargeAnimation
        total={amount}
        percent={percent}
        onReleaseConfirm={handleRelease}
      />
    </div>
  );
}

export default function ReleaseAnimationContent() {
  return (
    <Suspense fallback={<div>Loading params...</div>}>
      <InnerContent />
    </Suspense>
  );
}
