"use client";
import { ClientForm } from "@/components/forms/client-form";
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

export function ClientsHeader() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className=" font-workSans">
      <h2 className="font-bold">Clients</h2>
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
              <BreadcrumbPage className="text-[#F3A847] font-workSans font-bold">
                All Clients
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Button
          onClick={() => setOpenModal(true)}
          className="bg-[#F3A847] text-black font-medium hover:bg-[#F3A847]/90"
        >
          <PlusCircle />
          Add Client
        </Button>
      </div>

      <FormModal
        title="Add Client"
        openModal={openModal}
        setOpenModal={setOpenModal}
      >
        <ClientForm closeModal={() => setOpenModal(false)} />
      </FormModal>
    </div>
  );
}
