import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Tag } from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";
import { CopyCodeButton } from "./CopyCodeButton";
import { COUPON_CODES } from "@/sanity/lib/sales/couponCodes";
import { getActiveSaleByCouponCode } from "@/sanity/lib/sales/getActiveSaleByCouponCode";

async function BlackFridayBanner() {
  const sale = await getActiveSaleByCouponCode(COUPON_CODES.BFRIDAY);

  if (!sale?.isActive) {
    return null;
  }

  return (
    <Alert className="bg-gradient-to-r from-red-600 to-black text-white px-6 py-10 mx-4 mt-2 rounded-lg shadow-lg border-none">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <Sparkles className="h-8 w-8 animate-pulse" />
          <div>
            <AlertTitle className="text-2xl font-bold mb-2">
              Black Friday Special!
            </AlertTitle>
            <AlertDescription className="text-lg opacity-90">
              {sale.description}
            </AlertDescription>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-3">
          <CountdownTimer endDate={sale.validUntil ?? ""} />

          <Badge className="bg-red-500 hover:bg-red-600 px-4 py-2 text-lg">
            <Tag className="h-4 w-4 mr-2" />
            Use code: {sale.couponCode} for {sale.discountAmount}% off!
          </Badge>

          <CopyCodeButton couponCode={sale.couponCode ?? ""} />
        </div>
      </div>
    </Alert>
  );
}

export default BlackFridayBanner;
