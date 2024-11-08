import { ICheckoutItems } from "@/types/client.dto";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card } from "@/components/ui/card";

import Image from "next/image";
import { formatAmount } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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
        <div className="space-y-3">
          <div className="px-6 py-6 rounded-lg bg-white w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className=" lg:w-[150px] w-[180px]">
                    Item Name
                  </TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-center">Price</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {items && items.length > 0 ? (
                  items.map((it, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell className="font-medium flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={it.image} />
                            <AvatarFallback>P</AvatarFallback>
                          </Avatar>

                          <p className="overflow-hidden truncate">
                            {it.item_name}
                          </p>
                        </TableCell>
                        <TableCell className="text-center">
                          {it.quantity}
                        </TableCell>
                        <TableCell className="text-center text-sm whitespace-nowrap">
                          N {`${it.item_price}`}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-lg">
                      No Checkout Items
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
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
