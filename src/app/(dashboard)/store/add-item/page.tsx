import { ItemForm } from "@/components/dashboard/store/add-item/item-form";
import { AddItemHeader } from "@/components/dashboard/store/add-item/add-item-header";
import { Suspense } from "react";

export default function AddItem() {
  return (
    <Suspense>
      <AddItemHeader />
      <ItemForm />
    </Suspense>
  );
}
