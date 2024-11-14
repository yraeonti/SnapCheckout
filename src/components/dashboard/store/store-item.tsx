import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatAmount } from "@/lib/utils";
import { IStore } from "@/types/store.dto";
import { MoreVertical } from "lucide-react";
import Image from "next/image";
import { StoreItemActions } from "./store-item-actions";

interface StoreItemProps {
  item: IStore;
  recommend?: boolean;
}
export function StoreItem({ item, recommend }: StoreItemProps) {
  return (
    <Card className="max-w-sm bg-white rounded-3xl p-3 shadow-sm font-workSans">
      <div className="rounded-2xl overflow-hidden bg-gray-50 mb-3">
        <Image
          src={item?.image ?? ""}
          alt={item.item_name}
          className="w-full aspect-square object-cover"
          width={250}
          height={250}
        />
      </div>

      <div className="space-y-2 px-1">
        <div className="flex justify-between items-start">
          <h3 className="capitalize font-normal text-gray-900/50">
            {item.item_name}
          </h3>
          {!recommend && <StoreItemActions item_id={item.id} />}
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className="text-sm font-medium">
            NGN {formatAmount(Number(item.item_price))}
          </p>
          {!recommend && (
            <span className="text-sm">Quantity: {item?.item_quantity}</span>
          )}
        </div>
      </div>
    </Card>
  );
}
