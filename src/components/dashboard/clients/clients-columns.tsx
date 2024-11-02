"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import { cn, formatAmount } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

import { ArrowUpDown, MoreVertical } from "lucide-react";
import { IClient, PaymentStatus } from "@/types/client.dto";
import TruncatedTextCell from "@/components/truncated-text";
import { ClientActions } from "./clients-table-actions";

export const clients_column: ColumnDef<IClient>[] = [
  {
    accessorKey: "name",
    header: () => <p>Name</p>,
    cell: ({ row }) => {
      return <p>{row?.original?.name}</p>;
    },
  },
  {
    accessorKey: "email",
    header: () => <p>Email</p>,
    cell: ({ row }) => {
      return <p>{row?.original?.email}</p>;
    },
  },
  {
    accessorKey: "checkout.payment_status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className=" "
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Payment Status
          <ArrowUpDown className=" ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status: PaymentStatus | undefined =
        row?.original.checkout?.payment_status;
      return (
        <Badge
          variant="outline"
          className={cn(
            "uppercase py-1 px-2 rounded-lg font-bold",
            status === "FAILED" && " text-[#B83131]",
            status === "COMPLETED" && " text-[#165E3D]",
            status === "PENDING" && " text-[#877513]"
          )}
        >
          {status}
        </Badge>
      );
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
    accessorKey: "short_link",
    header: () => <p>Short Link</p>,
    cell: ({ row }) => {
      return <TruncatedTextCell text={row?.original?.short_link} />;
    },
  },

  {
    accessorKey: "actions",
    header: () => <p>Actions</p>,
    cell: ({ row }) => {
      return <ClientActions client={row?.original} />;
    },
  },
];
