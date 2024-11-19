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
import { MapPin, Pencil, Trash2Icon, User } from "lucide-react";
import Image from "next/image";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
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

export default function CheckoutUI({
  data,
  short_link,
}: {
  data: Items;
  short_link: string;
}) {
  const items = data.checkout?.items && data.checkout.items;

  const status = data.checkout?.payment_status;

  const [callbackSend, setCallbackSend] = useState(0);

  const [isDeleting, setIsDeleting] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [editLocation, setEditLocation] = useState(false);

  const [curDel, setCurDel] = useState("");

  const [address, setAddress] = useState("");

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
    merchant_key: "PZ78-PKTEST-E1F4A882-BB27-4979-AB4E-DE2459FF9B98",
    connection_mode: ConnectionMode.TEST, // Live || Test
    checkout_amount: total,
    currency_code: "NGN",
    email_address: data.email,
    first_name: data.name || "Snap",
    last_name: data.name || "Checkout",
    phone_number: data.phone || "+2348162479362",
    transaction_reference: `${data.checkout?.id}T${Date.now()}`,
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
        if (callbackSend > 0) {
          return;
        }
        const res = await fetch("/api/checkout/ongoing", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            checkout_id: data.checkout?.id,
            items: items?.map((it) => ({ id: it.id })) || [],
            tx_reference: callbackResponse.data.payaza_reference,
          }),
        });

        if (res.ok) {
          router.refresh();
        }

        setCallbackSend((prev) => prev + 1);
      }
    },
  });

  const handleDeleteCheckout = async (checkout_item_id: string) => {
    setIsDeleting(true);
    setCurDel(checkout_item_id);
    await fetch("/api/client/checkout", {
      method: "DELETE",
      body: JSON.stringify({
        checkout_item_id,
      }),
    });

    router.refresh();

    setTimeout(() => {
      setIsDeleting(false);
    }, 900);
  };

  const handleEditAddress = async (
    checkout_item_id: string,
    address: string
  ) => {
    setIsEditing(true);
    setCurDel(checkout_item_id);
    await fetch("/api/client/checkout", {
      method: "PATCH",
      body: JSON.stringify({
        short_link,
        location: address,
      }),
    });

    router.refresh();

    setTimeout(() => {
      setIsEditing(false);
      setEditLocation(false);
    }, 900);
  };
  return (
    <div className="">
      <h1 className="text-base text-[#F3A847] py-4">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="px-6 py-6 rounded-lg bg-white w-full h-fit">
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
            <User className="stroke-green-500" />

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

              {/* {data.phone && (
                <div className="flex items-center gap-2 truncate whitespace-nowrap">
                  <p>Phone Number:</p> <p>{data.phone}</p>
                </div>
              )} */}
            </div>
          </div>
          {items && items?.length > 0 && (
            <div className="flex items-center gap-4 mt-4 text-sm ">
              <MapPin className="stroke-green-500" />

              <div className="flex  items-center gap-4 truncate whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <p className="">Delivery Address:</p>{" "}
                  {editLocation ? (
                    <div className="min-w-56">
                      <Input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full outline-none focus-visible:ring-0"
                        placeholder="Enter Address"
                      />
                      <div className="flex items-center justify-end gap-4 mt-4">
                        <Button
                          className=""
                          onClick={() => setEditLocation(false)}
                        >
                          Cancel
                        </Button>

                        {isEditing ? (
                          <Image
                            src="/rhombus.gif"
                            alt="rhombus"
                            height={30}
                            width={30}
                          />
                        ) : (
                          <Button
                            className="bg-[#F3A847] hover:bg-[#F3A847]"
                            onClick={() =>
                              handleEditAddress(short_link, address)
                            }
                          >
                            Edit
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p>{data?.location || "N/A"}</p>
                  )}
                </div>
                {!editLocation && (
                  <div
                    className="rounded-full p-[0.3rem] bg-[#F3A847] cursor-pointer"
                    onClick={() => {
                      setEditLocation(true);
                    }}
                  >
                    <Pencil className="size-4 stroke-white " />
                  </div>
                )}
              </div>
            </div>
          )}

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
            {items && items?.length > 0 && (
              <button
                onClick={() =>
                  status === "PENDING" || status === "FAILED"
                    ? payazaCheckout.showPopup()
                    : {}
                }
                className={cn(
                  "flex items-center py-2 text-center px-2 rounded-e-lg rounded-s-lg text-white cursor-pointer w-full",
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
              </button>
            )}
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
                  <TableHead className="text-right"></TableHead>
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
                          NGN {`${it.item_price}`}
                        </TableCell>

                        <TableCell className=" text-sm whitespace-nowrap ">
                          {isDeleting && it.id == curDel ? (
                            <Image
                              src="/rhombus.gif"
                              alt="rhombus"
                              height={30}
                              width={30}
                            />
                          ) : (
                            <>
                              <Trash2Icon
                                className="stroke-red-600 cursor-pointer"
                                onClick={() => handleDeleteCheckout(it.id)}
                              />
                            </>
                          )}
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
