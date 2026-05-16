"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { diamonds } from "@/constants";

export default function DiamondsPage() {
  const sortedDiamonds = [...diamonds].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  return (
    <main className="py-15">
      <section className="app_container space-y-15">
        <h1 className="text-center">Diamond Shapes and Colors</h1>
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-8 md:gap-12 max-w-[1200px] mx-auto mt-16">
          {sortedDiamonds.map((diamond) => (
            <div key={diamond.name}>
              <Dialog>
                <DialogTrigger asChild>
                  <div className="flex items-start gap-3 mb-4 break-inside-avoid">
                    <span className="size-1.5 mt-3 bg-foreground rounded-full shrink-0"></span>
                    <span className="text-lg text-foreground font-medium tracking-wide">
                      {diamond.name}
                    </span>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-6xl w-[95vw] h-[95vh] flex flex-col p-0 overflow-hidden">
                  <DialogHeader className="px-6 py-4 border-b hidden">
                    <DialogTitle>{diamond.name}</DialogTitle>
                  </DialogHeader>

                  <div className="flex-1 overflow-hidden bg-white relative">
                    <iframe
                      src="/diamond-ashoka-cut.pdf#view=FitH&toolbar=0&navpanes=0"
                      className="absolute inset-0 w-[calc(100%+12px)] h-[calc(100%+12px)] -left-1.5 -top-1.5 border-none outline-none bg-white"
                      title={diamond.name}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
