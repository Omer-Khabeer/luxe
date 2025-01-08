"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyCodeButtonProps {
  couponCode: string;
}

export function CopyCodeButton({ couponCode }: CopyCodeButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(couponCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Button
      className="bg-white text-black hover:bg-gray-200 font-semibold px-6"
      onClick={handleCopy}
    >
      {isCopied ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="h-4 w-4 mr-2" />
          Copy Code
        </>
      )}
    </Button>
  );
}
