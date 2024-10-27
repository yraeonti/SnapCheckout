import { ItemForm } from "@/components/dashboard/store/add-item/item-form";
import { AddItemHeader } from "@/components/dashboard/store/add-item/add-item-header";

export default function AddItem() {
  return (
    <div>
      <AddItemHeader />
      <ItemForm />
    </div>
  );
}
