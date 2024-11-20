import CheckoutUI from "@/components/checkout-ui";
import { db } from "@/lib/db";
import Image from "next/image";
import RecommendedProducts from "@/components/recomended-products";
import StoreItems from "@/components/client-store-items";

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const data = await db.client.findUnique({
    where: {
      short_link: slug,
    },
    include: {
      checkout: {
        include: {
          items: {
            where: {
              paid: false,
            },
          },
        },
      },
    },
  });

  const storeData = await db.store.findMany({
    where: {
      user_id: data?.user_id,
      item_quantity: { gt: 0 },
      deletedAt: { isSet: false },
    },
    include: {
      category: {
        select: {
          category: true,
        },
      },
    },
  });

  if (!data) {
    return <div>No data found {slug}</div>;
  }

  // return <div>{JSON.stringify(data, null, 2)}</div>;

  return (
    <main className="flex flex-col min-h-full bg-[#F5F5F5]">
      <header className="flex justify-between items-center sm:px-10 px-4 py-6 bg-white">
        <div className="sm:hidden"></div>
        <div className="relative h-16 w-24 hidden sm:block">
          <Image src={"/logo-dark.svg"} alt="Snap Checkout" fill />
        </div>

        <div className="overflow-hidden truncate text-sm px-3 py-2 bg-[#F5F5F5] flex items-center gap-2 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
              clipRule="evenodd"
            />
          </svg>
          <p>{data.email}</p>
        </div>
      </header>

      <section className="sm:px-10 px-4 pb-10 mb-10">
        <CheckoutUI data={data} short_link={slug} />

        <section className="mt-10">
          <StoreItems data={storeData} short_link={slug} />
        </section>

        <section className="mt-10 relative">
          <RecommendedProducts slug={slug} />
        </section>
      </section>
    </main>
  );
}
