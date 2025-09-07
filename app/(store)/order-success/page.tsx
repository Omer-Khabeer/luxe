// app/(store)/order-success/page.tsx
import { Suspense } from "react";
import OrderSuccessPage from "@/components/orders/OrderSuccessPage";

export const dynamic = "force-dynamic";

function Loading() {
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
        <p className="text-amber-900">Lade Bestelldetails...</p>
      </div>
    </div>
  );
}

export default function OrderSuccess() {
  return (
    <Suspense fallback={<Loading />}>
      <OrderSuccessPage />
    </Suspense>
  );
}
