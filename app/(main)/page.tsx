import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function HomePage() {
  return (
    <main className="app_container flex flex-col space-y-5">
      <h1 className="text-6xl">Hello world</h1>
      <p className="text-4xl">Hello World</p>

      <div className="space-x-5">
        <Button className="h-10.5">Watch Me</Button>
        <Button variant="outline">Watch Me</Button>
      </div>
      <div className="space-x-5">
        <Button size="lg">Watch Me</Button>
        <Button variant="outline" size="lg">
          Watch Me
        </Button>
      </div>

      <Carousel>
        <CarouselContent>
          {[...Array(5)].map((_, index) => (
            <CarouselItem
              // biome-ignore lint/suspicious/noArrayIndexKey: static list
              key={index}
              className="lg:basis-1/3"
            >
              <div className="bg-amber-500 h-20">{index + 1}</div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <Sheet>
        <SheetTrigger asChild>
          <Button>Open</Button>
        </SheetTrigger>
        <SheetContent className="bg-background data-[side=right]:border-0 data-[side=right]:sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>Hello World</SheetTitle>
          </SheetHeader>
          <p>Hello World</p>
        </SheetContent>
      </Sheet>

      <Dialog>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent className="bg-background rounded-none">
          <DialogHeader>
            <DialogTitle>Hello World</DialogTitle>
          </DialogHeader>
          <p>Hello World</p>
        </DialogContent>
      </Dialog>

      <Input placeholder="Name" />
    </main>
  );
}
