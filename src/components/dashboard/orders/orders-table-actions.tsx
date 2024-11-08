"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreVertical, Plus, Trash, View } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useState } from "react";
import { FormModal } from "@/components/modals/form-modal";

import { CheckoutItemDetails } from "@/components/modals/checkout-item-details";
import { IOrder } from "@/types/order.dto";
import { OrderStatusForm } from "@/components/forms/order-status-form";

type OrderTableActionProps = {
  order: IOrder;
};

export const OrderTableActions = ({ order }: OrderTableActionProps) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openCheckoutItemModal, setOpenCheckoutItemModal] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer flex items-center justify-between"
            onClick={() => setOpenEdit(true)}
          >
            Edit Order Status
            <Edit className="ml-2 w-4 h-4" />
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer flex items-center justify-between"
            onClick={() => setOpenCheckoutItemModal(true)}
          >
            View Checkout Items
            <View className="ml-2 w-4 h-4" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <FormModal
        title="Checkout Items"
        openModal={openCheckoutItemModal}
        setOpenModal={setOpenCheckoutItemModal}
      >
        <CheckoutItemDetails items={order.checkout_items} />
      </FormModal>
      <FormModal
        title="Edit Order Status"
        openModal={openEdit}
        setOpenModal={setOpenEdit}
      >
        <OrderStatusForm order={order} closeModal={() => setOpenEdit(false)} />
      </FormModal>
    </>
  );
};
