import { db } from "@/lib/db";

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

      await db.order.update({
        where: {
          tx_reference,
        },
        data: {
          checkout: {
            update: {
              payment_status:
                checkout_items_count > 0 ? "COMPLETED" : "PENDING",
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
