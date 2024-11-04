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
import { IClient } from "@/types/client.dto";
import { useState } from "react";
import { FormModal } from "@/components/modals/form-modal";
import { ClientForm } from "@/components/forms/client-form";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { useDeleteClientMutation } from "@/hooks/mutations/clients-mutations";
import { CheckoutForm } from "@/components/forms/checkout-form";
import { CheckoutItemDetails } from "@/components/modals/checkout-item-details";

type ClientTableActionProps = {
  client: IClient;
};

export const ClientActions = ({ client }: ClientTableActionProps) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openCheckoutModal, setOpenCheckoutModal] = useState(false);
  const [openCheckoutItemModal, setOpenCheckoutItemModal] = useState(false);

  const { mutate: deleteClient, isPending } = useDeleteClientMutation(
    client?.id
  );
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
            Edit Client
            <Edit className="ml-2 w-4 h-4" />
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer flex items-center justify-between"
            onClick={() => setOpenDeleteModal(true)}
          >
            Delete Client
            <Trash className="ml-2 w-4 h-4" />
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer flex items-center justify-between"
            onClick={() => setOpenCheckoutItemModal(true)}
          >
            View Checkout Items
            <View className="ml-2 w-4 h-4" />
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer flex items-center justify-between"
            onClick={() => setOpenCheckoutModal(true)}
          >
            Add Checkout Item
            <Plus className="ml-2 w-4 h-4" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <FormModal
        title="Edit Client"
        openModal={openEdit}
        setOpenModal={setOpenEdit}
      >
        <ClientForm closeModal={() => setOpenEdit(false)} client={client} />
      </FormModal>

      <FormModal
        title="Add Checkout Item"
        openModal={openCheckoutModal}
        setOpenModal={setOpenCheckoutModal}
      >
        <CheckoutForm
          closeModal={() => setOpenCheckoutModal(false)}
          client={client}
        />
      </FormModal>

      <FormModal
        title="Checkout Items"
        openModal={openCheckoutItemModal}
        setOpenModal={setOpenCheckoutItemModal}
      >
        <CheckoutItemDetails items={client.checkout?.items} />
      </FormModal>

      <ConfirmModal
        title="Are sure?"
        subTitle={`Are you sure you want to delete this ${client.name}`}
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
        action={deleteClient}
        closeAction={() => setOpenDeleteModal(false)}
        actionButtonText="Delete"
        closeButtonText="Cancel"
        isLoading={isPending}
      />
    </>
  );
};
