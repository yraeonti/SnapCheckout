import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Client, Checkout, CheckoutItems } from "@prisma/client";
import PayazaCheckout from "payaza-web-sdk";
import { ConnectionMode } from "payaza-web-sdk/lib/PayazaCheckout";

type Items = Client & {
  checkout: (Checkout & { items: CheckoutItems[] | null }) | null;
};

export default function CheckoutUI({ data }: { data: Items }) {
  const items = data.checkout?.items && data.checkout.items;

  const subtotal =
    (items &&
      items.reduce(
        (prev, acc) => (prev = prev + acc.item_price * acc.quantity),
        0
      )) ||
    0;

  let total = subtotal + (data.checkout?.delivery || 0);

  const discount = (total * (data.checkout?.discount || 0)) / 100 || 0;

  total = total - discount;

  //   const payazaCheckout = new PayazaCheckout({
  //     merchant_key: "<public key>",
  //     connection_mode: ConnectionMode.LIVE, // Live || Test
  //     checkout_amount: Number(2000),
  //     currency_code: "NGN",
  //     email_address: "example@email.com",
  //     first_name: '<first name>',
  //     last_name: '<last name>',
  //     phone_number: "+1200000000",
  //     transaction_reference: 'your_reference',

  //     //Additional Details (metadata)
  //      additional_details: {
  //         user_id: 1273,
  //         ticket: "TEUBD9382892"
  //     },

  //     onClose: function() {
  //       console.log("Closed")
  //     },
  //     callback: function(callbackResponse) {
  //       console.log(callbackResponse)
  //     }
  //   });

  return (
    <div className="flex-1 h-full bg-[#F5F5F5] sm:px-10 px-4 pb-10">
      <h1 className="text-base text-[#F3A847] py-7">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="px-6 py-6 rounded-lg bg-white w-full">
          <div className="space-y-2">
            <h1 className="font-semibold text-[18px] font-workSans">
              Payment Option
            </h1>
            <p className="text-[#626262] text-sm">
              Click below to pay for items
            </p>
          </div>

          <div className="mt-10">
            <div className="bg-[#F3A847] flex items-center py-2 text-center px-2 rounded-e-full rounded-s-full text-white cursor-pointer">
              <p className="mx-auto font-semibold">Pay now</p>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-8 animate-translate"
              >
                <path
                  fillRule="evenodd"
                  d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

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
                {items &&
                  items.length > 0 &&
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
                  })}
              </TableBody>
            </Table>
          </div>

          {items && items.length > 0 && (
            <div className="px-6 py-6 rounded-lg bg-white w-full">
              <h1 className="font-semibold text-[18px] font-workSans">
                Order Summary
              </h1>

              <Separator className="my-5" />

              <div className=" space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <p>Sub Total:</p>

                  <p className="">N {`${subtotal}`}</p>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <p>Delivery:</p>

                  <p className="">N 0</p>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <p>Discount:</p>

                  <p className="">% {discount}</p>
                </div>

                <div className="flex justify-between items-center text-[16px] font-semibold">
                  <p>Total:</p>

                  <p className="">N {total}</p>
                </div>
              </div>

              <Separator className="my-5" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
