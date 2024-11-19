"use client";
import { Store } from "@prisma/client";
import { StoreItem } from "./dashboard/store/store-item";
import { IStore } from "@/types/store.dto";

export default function StoreItems({
  data,
  short_link,
}: {
  data: Store[];
  short_link: string;
}) {
  return (
    <section className="">
      <h1 className="font-medium text-2xl my-4">Browse Products</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.map((dat, i) => {
          return (
            <StoreItem
              item={dat as any as IStore}
              short_link={short_link}
              key={i}
              recommend
            />
          );
        })}
      </div>
    </section>
  );
}
