import { storeItems } from "@/static/static";
import { StoreItem } from "./store-item";

export function StoreItems() {
  return (
    <section className="p-2 bg-white w-full grid grid-cols-1 gap-3 md:grid-rows-3 sm:grid-cols-2 lg:grid-cols-4 my-3">
      {storeItems.map((item) => (
        <StoreItem item={item} key={item.id} />
      ))}
    </section>
  );
}
