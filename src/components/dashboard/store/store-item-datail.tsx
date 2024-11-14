import { formatAmount } from "@/lib/utils";

import Image from "next/image";

import { useGetStoreItem } from "@/hooks/mutations/store-mutations";
import { Skeleton } from "@/components/ui/skeleton";

interface StoreItemDetailProps {
  item_id: string;
}
export function StoreItemDetail({ item_id }: StoreItemDetailProps) {
  const { isLoading, data } = useGetStoreItem(item_id);
  return (
    <>
      {isLoading && (
        <Skeleton className="max-w-lg bg-gray-200 h-full rounded-3xl p-3" />
      )}
      {!isLoading && data && (
        <div className="max-w-lg  p-3">
          <div className="rounded-2xl overflow-hidden bg-gray-50 mb-3 w-full font-workSans">
            <Image
              src={data?.image ?? ""}
              alt={data.item_name}
              className="w-full aspect-square object-cover"
              width={300}
              height={300}
            />
          </div>

          <div className="space-y-2 px-1">
            <p className="text-sm font-medium">
              NGN {formatAmount(Number(data.item_price))}
            </p>

            <p className="text-sm">Quantity available: {data?.item_quantity}</p>

            <p className="text-sm">Item Name: {data?.item_name}</p>
            {/* category is an object */}
            <p className="text-sm">Description: {data?.description}</p>

            <p className="text-sm">Category: {data?.category?.category}</p>
          </div>
        </div>
      )}
    </>
  );
}
