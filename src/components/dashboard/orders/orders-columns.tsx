"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

import { ArrowUpDown } from "lucide-react";

import { OrderTableActions } from "./orders-table-actions";
import { IOrder, ORDER_STATUS } from "@/types/order.dto";

export const orders_column: ColumnDef<IOrder>[] = [
  {
    accessorKey: "tx_reference",
    header: () => <p>TXN Ref</p>,
    cell: ({ row }) => {
      return <p>{row?.original?.tx_reference}</p>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className=" "
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Order Status
          <ArrowUpDown className=" ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status: ORDER_STATUS | undefined = row?.original.status;

      return (
        <Badge
          variant="outline"
          className={cn(
            "uppercase py-1 px-2 rounded-lg font-bold",
            status === ORDER_STATUS.FAILED && " text-[#B83131]",
            status === ORDER_STATUS.COMPLETED && " text-[#165E3D]",
            status === ORDER_STATUS.PENDING && " text-[#877513]",
            status === ORDER_STATUS.ONGOING && ""
          )}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "checkout_id",
    header: () => <p>Checkout Id</p>,
    cell: ({ row }) => {
      return <p>{row?.original?.checkout_id}</p>;
    },
  },

  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Created
          <ArrowUpDown className=" ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <p className="">
          {format(new Date(row?.original?.created_at || ""), "eeee, p")}
        </p>
      );
    },
  },

  {
    accessorKey: "actions",
    header: () => <p>Actions</p>,
    cell: ({ row }) => {
      return <OrderTableActions order={row?.original} />;
    },
  },
];
