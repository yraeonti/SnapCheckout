import { ItemForm } from "@/components/dashboard/store/add-item/item-form";
import { AddItemHeader } from "@/components/dashboard/store/add-item/add-item-header";
import { Suspense } from "react";

export default function EditItem() {
  return (
    <Suspense>
      <AddItemHeader title="Edit Item" />
      <ItemForm />
    </Suspense>
  );
}
