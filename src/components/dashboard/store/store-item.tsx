import { Card } from "@/components/ui/card";
import { formatAmount } from "@/lib/utils";
import { IStore } from "@/types/store.dto";
import Image from "next/image";
import { StoreItemActions } from "./store-item-actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface StoreItemProps {
  item: IStore;
  recommend?: boolean;
  short_link?: string;
}
export function StoreItem({ item, recommend, short_link }: StoreItemProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [open, setOpen] = useState(false);

  const handleAddtoCart = async () => {
    setIsLoading(true);
    const res = await fetch("/api/client/checkout", {
      method: "POST",
      body: JSON.stringify({
        short_link: short_link,
        product_id: item.id,
        quantity,
      }),
    });

    if (res.ok) {
      router.refresh();
    }

    setTimeout(() => {
      setIsLoading(false);
      setOpen(false);
    }, 900);
  };

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

      {recommend && (
        <div className="px-1">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
              <p className="hover:underline text-[#F3A847] mt-2 text-sm">
                Add to Checkout
              </p>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add To Checkout</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl overflow-hidden bg-gray-50 mb-3">
                  <Image
                    src={item?.image ?? ""}
                    alt={item.item_name}
                    className="w-full aspect-square object-cover"
                    width={250}
                    height={250}
                  />
                </div>

                <div className="whitespace-normal space-y-2">
                  <h2 className="font-bold">
                    {" "}
                    NGN {formatAmount(Number(item.item_price))}
                  </h2>
                  <h2 className="font-semibold">{item.item_name}</h2>

                  <p className="font-extralight">{item.description}</p>
                </div>
              </div>

              <div className=" flex justify-center items-center gap-8">
                <div className="flex items-center gap-3">
                  <Button
                    className="rounded-full p-2 size-10 text-lg"
                    onClick={() =>
                      setQuantity((prev) => (prev > 1 && prev - 1) || 1)
                    }
                  >
                    -
                  </Button>

                  <p className="text-lg">{quantity}</p>

                  <Button
                    className="rounded-full p-2 size-10 text-lg"
                    onClick={() =>
                      setQuantity(
                        (prev) =>
                          (item?.item_quantity &&
                            prev < item.item_quantity &&
                            prev + 1) ||
                          prev
                      )
                    }
                  >
                    +
                  </Button>
                </div>

                {(isLoading && (
                  <Image
                    src="/rhombus.gif"
                    alt="rhombus"
                    height={30}
                    width={30}
                  />
                )) || (
                  <Button
                    className="bg-[#F3A847] hover:bg-[#F3A847]"
                    disabled={!quantity}
                    onClick={handleAddtoCart}
                  >
                    Add
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </Card>
  );
}
