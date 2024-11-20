"use client";
import { CategoryForm } from "@/components/forms/category-form";
import { FormModal } from "@/components/modals/form-modal";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface AddItemHeaderProps {
  title?: string;
}

export function AddItemHeader({ title = "Add Item" }: AddItemHeaderProps) {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className=" font-workSans">
      <h2 className="font-bold">Store</h2>
      <div className="flex justify-between items-center">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/store">Store</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage className="text-[#F3A847] font-workSans font-bold">
                {title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Button
          className="bg-[#F3A847] text-black font-medium hover:bg-[#F3A847]/90"
          onClick={() => setOpenModal(true)}
        >
          <PlusCircle />
          Add Category
        </Button>
      </div>

      <FormModal
        title="Add Item Category"
        openModal={openModal}
        setOpenModal={setOpenModal}
      >
        <CategoryForm closeModal={() => setOpenModal(false)} />
      </FormModal>
    </div>
  );
}
