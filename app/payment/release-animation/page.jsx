"use client";

import { Suspense } from "react";
import ReleaseAnimationContent from "@/app/payment/release-animation/ReleaseAnimationContent";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReleaseAnimationContent />
    </Suspense>
  );
}
