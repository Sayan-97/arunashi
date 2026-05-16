import { Download, Link2, Mail } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { productsData } from "@/constants";

export default function ShareProduct({ product }: { product: any }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="lg" className="w-full">
          Share with Client / Sales Team
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full p-8 md:p-12 flex flex-col gap-10 overflow-y-auto">
        <SheetHeader className="hidden">
          <SheetTitle></SheetTitle>
        </SheetHeader>
        <h1>Share Product</h1>

        <div className="border border-black/10 p-5 flex flex-col sm:flex-row gap-6 md:gap-8">
          <div className="bg-[#f6f6f6] w-[220px] h-[233px] shrink-0 relative flex items-center justify-center mx-auto sm:mx-0">
            <Image
              src={product.featuredImage}
              alt="Product Image"
              fill
              className="object-contain p-4"
            />
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <div>
              <h3 className="text-[22px] md:text-[26px] font-medium text-foreground leading-snug">
                {product.name}
              </h3>
              <p className="text-primary text-[14px] md:text-[15px] mt-1">
                {product.collection}
              </p>
            </div>
            <p className="text-[#8e8e8e] text-[13px] md:text-[14px] leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-[18px] h-[18px] bg-[#e6e6e6]"></div>
                <span className="text-[13px] md:text-[14px] font-medium text-foreground">
                  With MSRP
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-[18px] h-[18px] bg-[#e6e6e6]"></div>
                <span className="text-[13px] md:text-[14px] font-medium text-foreground">
                  Without MSRP
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <h4 className="text-lg font-medium text-foreground">Share Via</h4>
          <div className="space-y-4">
            <Button
              variant="outline"
              size="lg"
              className="w-full flex items-center justify-center gap-3 font-normal border-primary text-foreground hover:bg-primary/5"
            >
              <Link2 strokeWidth={1.5} className="w-5 h-5" />
              Copy share link
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full flex items-center justify-center gap-3 font-normal border-primary text-foreground hover:bg-primary/5"
            >
              <Mail strokeWidth={1.5} className="w-5 h-5" />
              Send via Email
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full flex items-center justify-center gap-3 font-normal border-primary text-foreground hover:bg-primary/5"
            >
              <Download strokeWidth={1.5} className="w-5 h-5" />
              Download photos / videos
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
