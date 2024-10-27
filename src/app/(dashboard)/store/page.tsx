import { StoreHeader } from "@/components/dashboard/store/store-header";
import { StoreItems } from "@/components/dashboard/store/store-items";

export default function Store() {
  return (
    <>
      <StoreHeader />
      <main className="">
        <StoreItems />
      </main>
    </>
  );
}
