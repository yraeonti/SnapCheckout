import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { checkout_id, items } = await req.json();

    console.log("items", items);

    await db.$transaction([
      db.checkout.update({
        where: {
          id: checkout_id,
        },
        data: {
          payment_status: "ONGOING",
        },
      }),
      db.order.create({
        data: {
          order_items: items,
        },
      }),
    ]);

    return new Response("ok");
  } catch (error) {
    console.log(error);

    return Response.json(
      {
        status: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}
