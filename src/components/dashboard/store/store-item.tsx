import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IStore } from "@/types/store.dto";
import { MoreVertical } from "lucide-react";
import Image from "next/image";

interface StoreItemProps {
  item: IStore;
}
export function StoreItem({ item }: StoreItemProps) {
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
          <Button variant="outline" size="icon" className="h-8 w-8 -mr-2">
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </Button>
        </div>

        <p className="text-lg font-medium">${item.item_price}</p>

        {/* <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-medium text-gray-900">
            {item.status}
          </span>

          {item.inventory && (
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-green-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${(item.inventory / 100) * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-600">
                {item.inventory} items
              </span>
            </div>
          )}
        </div> */}
      </div>
    </Card>
  );
}
