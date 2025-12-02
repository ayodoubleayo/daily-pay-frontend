"use client";

import { Suspense } from "react";
import TransferPageInner from "./transfer-inner";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TransferPageInner />
    </Suspense>
  );
}
