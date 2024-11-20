import { FormModal } from "@/components/modals/form-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IStore } from "@/types/store.dto";
import { Edit, EyeIcon, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { StoreItemDetail } from "./store-item-datail";
import { useDeleteStoreItem } from "@/hooks/mutations/store-mutations";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { ItemForm } from "./add-item/item-form";

type StoreItemActionProps = {
  item_id?: string;
  item?: IStore;
};

export const StoreItemActions = ({ item_id, item }: StoreItemActionProps) => {
  const [viewItem, setViewItem] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const { mutate: deleteStoreItem, isPending } = useDeleteStoreItem(item_id);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="h-8 w-8 -mr-2">
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer flex items-center justify-between"
            onClick={() => setViewItem(true)}
          >
            View Item
            <EyeIcon className="ml-2 w-4 h-4" />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer flex items-center justify-between"
            onClick={() => setOpenEditModal(true)}
          >
            Edit Item
            <Edit className="ml-2 w-4 h-4" />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer flex items-center justify-between"
            onClick={() => setOpenDeleteModal(true)}
          >
            Delete Item
            <Trash2 className="ml-2 w-4 h-4" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <FormModal title="Item" openModal={viewItem} setOpenModal={setViewItem}>
        <StoreItemDetail item_id={item_id ?? ""} />
      </FormModal>
      <FormModal
        title="Edit Item"
        openModal={openEditModal}
        setOpenModal={setOpenEditModal}
      >
        <ItemForm item={item} isModal />
      </FormModal>

      <ConfirmModal
        title="Are sure?"
        subTitle={`Are you sure you want to delete this item`}
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
        action={deleteStoreItem}
        closeAction={() => setOpenDeleteModal(false)}
        actionButtonText="Delete"
        closeButtonText="Cancel"
        isLoading={isPending}
      />
    </>
  );
};
