"use client";
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
import { PayazaCheckoutOptionsInterface } from "payaza-web-sdk/lib/PayazaCheckoutDataInterface";
import { ConnectionMode } from "payaza-web-sdk/lib/PayazaCheckout";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
type Items = Client & {
  checkout: (Checkout & { items: CheckoutItems[] | null }) | null;
};

interface PayazaData extends PayazaCheckoutOptionsInterface {
  additional_details: {
    [key: string]: any;
  };
}

class Payaza extends PayazaCheckout {
  constructor(data: PayazaData) {
    super(data);
  }
}

export default function CheckoutUI({ data }: { data: Items }) {
  const items = data.checkout?.items && data.checkout.items;

  const status = data.checkout?.payment_status;

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

  const router = useRouter();

  const payazaCheckout = new Payaza({
    merchant_key: "PZ78-PKTEST-C1B09A12-19A5-4E15-88FA-A718A3469E9D",
    connection_mode: ConnectionMode.TEST, // Live || Test
    checkout_amount: total,
    currency_code: "NGN",
    email_address: data.email,
    first_name: data.name || "Snap",
    last_name: data.name || "Checkout",
    phone_number: data.phone || "+2348162479362",
    transaction_reference: "tuama",
    currency: "NGN",
    //Additional Details (metadata)
    additional_details: {
      items: (items && items.map((it) => it.id)) || [],
    },
    onClose: function () {
      console.log("Closed");
    },
    callback: async function (callbackResponse: any) {
      console.log("callbackResponse", callbackResponse);

      if (callbackResponse.type === "success") {
        const res = await fetch("/api/checkout/ongoing", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ checkout_id: data.checkout?.id }),
        });

        if (res.ok) {
          router.refresh();
        }
      }
    },
  });

  return (
    <div className="flex-1 h-full bg-[#F5F5F5] sm:px-10 px-4 pb-10">
      <h1 className="text-base text-[#F3A847] py-7">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="px-6 py-6 rounded-lg bg-white w-full">
          <div className="flex gap-4 items-center text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
              <path
                fillRule="evenodd"
                d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
                clipRule="evenodd"
              />
            </svg>

            {new Date().toDateString()}
          </div>

          <Separator className="my-5" />

          <div className="flex items-center gap-4">
            <svg
              width="52"
              height="52"
              viewBox="0 0 52 52"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.8">
                <rect
                  x="0.5"
                  y="0.5"
                  width="47"
                  height="47"
                  rx="7.5"
                  fill="#E6F8ED"
                />
                <rect
                  x="0.5"
                  y="0.5"
                  width="47"
                  height="47"
                  rx="7.5"
                  stroke="#B0EAC7"
                />
                <path
                  d="M31.4308 26.6289C31.5472 26.6981 31.6908 26.7792 31.8535 26.871C32.5663 27.2731 33.6438 27.881 34.382 28.6035C34.8437 29.0554 35.2823 29.6509 35.3621 30.3805C35.4469 31.1563 35.1084 31.8843 34.4294 32.5312C33.2579 33.6473 31.8521 34.5417 30.0338 34.5417H21.2156C19.3972 34.5417 17.9915 33.6473 16.82 32.5312C16.141 31.8843 15.8025 31.1563 15.8873 30.3805C15.9671 29.6509 16.4057 29.0554 16.8674 28.6035C17.6056 27.881 18.6831 27.2731 19.3959 26.871C19.5586 26.7792 19.7022 26.6981 19.8186 26.6289C23.3726 24.5126 27.8768 24.5126 31.4308 26.6289Z"
                  fill="#008D38"
                />
                <path
                  d="M19.6248 20.2916C19.6248 17.3921 21.9753 15.0416 24.8747 15.0416C27.7742 15.0416 30.1247 17.3921 30.1247 20.2916C30.1247 23.1911 27.7742 25.5416 24.8747 25.5416C21.9753 25.5416 19.6248 23.1911 19.6248 20.2916Z"
                  fill="#008D38"
                />
              </g>
            </svg>

            <div className="text-[#626262] text-sm overflow-hidden">
              {data.name && (
                <div className="flex items-center gap-2 truncate whitespace-nowrap">
                  <p>Full Name:</p> <p>{data.name}</p>
                </div>
              )}

              {data.email && (
                <div className="flex items-center gap-2 truncate whitespace-nowrap">
                  <p>Email:</p> <p>{data.email}</p>
                </div>
              )}

              {data.name && (
                <div className="flex items-center gap-2 truncate whitespace-nowrap">
                  <p>Phone Number:</p> <p>{data.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* <div className="space-y-2">
            <h1 className="font-semibold text-[18px] font-workSans">
              Payment Option
            </h1>
            <p className="text-[#626262] text-sm">
              Click below to pay for items
            </p>
          </div> */}

          <Separator className="my-5" />

          <div className="mt-10">
            <div
              onClick={() =>
                status === "PENDING" || status === "FAILED"
                  ? payazaCheckout.showPopup()
                  : {}
              }
              className={cn(
                "flex items-center py-2 text-center px-2 rounded-e-lg rounded-s-lg text-white cursor-pointer",
                status === "PENDING" || status === "FAILED"
                  ? "bg-black"
                  : "bg-green-600"
              )}
            >
              <p className="mx-auto font-medium">
                {status === "PENDING" || status === "FAILED"
                  ? "Continue to Payment"
                  : "Payment Successful"}
              </p>

              {status === "PENDING" ||
                (status === "FAILED" && (
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
                ))}
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

                  <p className="">N {data.checkout?.delivery || 0}</p>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <p>Discount:</p>

                  <p className="">{discount}%</p>
                </div>

                <div className="flex justify-between items-center text-[16px] font-semibold">
                  <p>Total:</p>

                  <p className="">N {total}</p>
                </div>
              </div>

              <Separator className="my-5" />

              <div className="flex justify-between items-center text-sm">
                <p>Status:</p>

                <div
                  className={cn(
                    "capitalize",
                    status === "PENDING"
                      ? "text-[#CCAC00]"
                      : status === "FAILED"
                      ? "text-red-500"
                      : "text-green-600"
                  )}
                >
                  {data.checkout?.payment_status === "PENDING" ? (
                    "Pending..."
                  ) : status === "FAILED" ? (
                    "Failed"
                  ) : (
                    <div className="flex gap-2 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="#008D38"
                        className="size-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                          clipRule="evenodd"
                        />
                      </svg>

                      <p>Completed</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
