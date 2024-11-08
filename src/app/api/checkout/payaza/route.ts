import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    console.log("webhook data", data);

    if (data && data["status"] == "Completed") {
      const tx_reference = data.transaction_reference;

      const checkout_items_count = await db.checkoutItems.count({
        where: {
          tx_reference: { not: tx_reference },
          paid: false,
        },
      });

      const payment_status = checkout_items_count > 0 ? "COMPLETED" : "PENDING";

      await db.order.update({
        where: {
          tx_reference,
        },
        data: {
          checkout: {
            update: {
              payment_status: payment_status,
            },
          },
          checkout_items: {
            updateMany: {
              where: {
                tx_reference,
              },
              data: {
                paid: true,
              },
            },
          },
        },
      });
    }

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

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams;

    const ref = query.get("tx_reference")?.toString();
    const id = query.get("id")?.toString();

    if (!ref) {
      return new Response("ok");
    }

    // const data = await db.order.update({
    //   where: {
    //     tx_reference: ref,
    //   },
    //   data: {
    //     tx_reference: ref
    //   }
    // });

    // const data = await db.order.findMany({
    //   where: {
    //     tx_reference: ref,
    //   },
    //   include: {
    //     checkout: true,
    //   },
    // });

    const tx_reference = ref;

    const checkout_items_count = await db.checkoutItems.count({
      where: {
        tx_reference: { not: tx_reference },
        paid: false,
      },
    });

    const payment_status = checkout_items_count > 0 ? "COMPLETED" : "PENDING";

    const data = await db.order.update({
      where: {
        tx_reference,
      },
      data: {
        checkout: {
          update: {
            payment_status: payment_status,
          },
        },
        checkout_items: {
          updateMany: {
            where: {
              tx_reference,
            },
            data: {
              paid: true,
            },
          },
        },
      },
    });

    return Response.json({
      status: true,
      data,
    });
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
