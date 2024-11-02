"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreVertical, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { IClient } from "@/types/client.dto";
import { useState } from "react";
import { FormModal } from "@/components/modals/form-modal";
import { ClientForm } from "@/components/forms/client-form";

type ClientTableActionProps = {
  client: IClient;
};

export const ClientActions = ({ client }: ClientTableActionProps) => {
  const [openEdit, setOpenEdit] = useState(false);
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

          <DropdownMenuItem className="cursor-pointer flex items-center justify-between">
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
    </>
  );
};
