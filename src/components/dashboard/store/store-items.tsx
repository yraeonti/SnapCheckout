"use client";

import { StoreItem } from "./store-item";
import { useGetStoreItems } from "@/hooks/mutations/store-mutations";
import { Skeleton } from "@/components/ui/skeleton";

export function StoreItems() {
  const { isLoading, data } = useGetStoreItems();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 md:grid-rows-3 sm:grid-cols-2 lg:grid-cols-4 my-3">
        <Skeleton className="max-w-sm bg-gray-100 rounded-3xl p-3 h-40" />
        <Skeleton className="max-w-sm bg-gray-100 rounded-3xl p-3 h-40" />
      </div>
    );
  }

  return (
    <section className="p-2 bg-white w-full grid grid-cols-1 gap-3 md:grid-rows-3 sm:grid-cols-2 lg:grid-cols-4 my-3">
      {data?.length ? (
        data.map((item) => <StoreItem item={item} key={item.id} />)
      ) : (
        <div className="text-center text-gray-400">No items found.</div>
      )}
    </section>
  );
}
