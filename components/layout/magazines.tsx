import Link from "next/link";
import MagazineCard from "@/components/shared/magazine-card";
import { Button } from "@/components/ui/button";
import { magazines } from "@/constants";

export default function Magazines() {
  return (
    <section className="app_container space-y-15">
      <div className="flex items-center justify-between">
        <h1>Latest Magazines</h1>
        <Link href="magazines">
          <Button variant="outline">View All</Button>
        </Link>
      </div>
      <div className="grid lg:grid-cols-3 gap-11.75">
        {magazines.slice(0, 3).map((magazine) => (
          <div key={magazine.id}>
            <MagazineCard
              image={magazine.image}
              title="Magazine Name"
              link="/products"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
