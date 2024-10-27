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

export function StoreHeader() {
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
              <BreadcrumbPage className="text-[#F3A847] font-workSans font-bold">
                All Items
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Link href={"/store/add-item"}>
          <Button className="bg-[#F3A847] text-black font-medium hover:bg-[#F3A847]/90">
            <PlusCircle />
            Add Item
          </Button>
        </Link>
      </div>
    </div>
  );
}
