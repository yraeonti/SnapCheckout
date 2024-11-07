import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { checkout_id, items, tx_reference } = await req.json();

    if (!Array.isArray(items)) {
      return Response.json(
        {
          status: false,
          message: "items is an array of checkout items",
        },
        {
          status: 400,
        }
      );
    }

    if (!(items.length > 0)) {
      return Response.json(
        {
          status: false,
          message: "items cannot be empty",
        },
        {
          status: 400,
        }
      );
    }

    if (!tx_reference) {
      return Response.json(
        {
          status: false,
          message: "tx_reference is required",
        },
        {
          status: 400,
        }
      );
    }

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
          checkout_items: {
            connect: items,
          },
          tx_reference,
          checkout_id: checkout_id,
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
