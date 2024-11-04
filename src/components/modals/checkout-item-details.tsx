import { ICheckoutItems } from "@/types/client.dto";

import { Card } from "@/components/ui/card";

import Image from "next/image";
import { formatAmount } from "@/lib/utils";

export const CheckoutItemDetails = ({
  items,
}: {
  items?: ICheckoutItems[];
}) => {
  const totalPrice =
    items?.reduce((acc, item) => acc + item.item_price, 0) ?? 0;
  return (
    <>
      <div className="max-h-[600px] w-full overflow-y-auto">
        <section className="p-2 bg-white w-full grid grid-cols-1 gap-3  lg:grid-cols-2 my-3">
          {items?.length ? (
            items.map((item) => <CheckoutItem item={item} key={item.id} />)
          ) : (
            <div className="text-center text-gray-400">No items found.</div>
          )}
        </section>
        <div className="text-right p-4">
          <p className="font-bold">Total: NGN {formatAmount(totalPrice)}</p>
        </div>
      </div>
    </>
  );
};

interface CheckoutItemProps {
  item: ICheckoutItems;
}
export function CheckoutItem({ item }: CheckoutItemProps) {
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
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className="text-lg font-medium">
            {" "}
            NGN {formatAmount(item.item_price)}
          </p>
          <span className="text-sm">Quantity: {item.quantity}</span>
        </div>
      </div>
    </Card>
  );
}
