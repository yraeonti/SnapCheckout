import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import { genAI, model_flash, receipt_sys_instruction } from "../../gemini";
import { sendMail, receipt_template } from "../../email";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const model = genAI.getGenerativeModel({
  model: model_flash,
  systemInstruction: receipt_sys_instruction,
  generationConfig: {
    temperature: 0.4,
    // topK: 8,
    // topP: 0.5,
  },
});

export async function POST(req: Request) {
  try {
    const data = await req.json();

    console.log("webhook data", data);

    if (data && data["status"] == "Completed") {
      const tx_reference = data.transaction_reference;

      console.log("tx_reference", data.transaction_reference);

      const checkout_items_count = await db.checkoutItems.count({
        where: {
          tx_reference: { not: tx_reference },
          paid: false,
        },
      });

      const payment_status =
        checkout_items_count === 0 ? "COMPLETED" : "PENDING";

      let n_exi = true;
      const two = new Date();

      two.setMinutes(two.getMinutes() + 2);

      while (n_exi) {
        const orders = await db.order.findMany({
          where: {
            tx_reference,
          },
        });

        console.log("orders 0000", orders);

        if (!orders) {
          await delay(3000);
        }

        if (orders.length > 0 || new Date(two) <= new Date()) {
          n_exi = false;
        }
      }

      const order = await db.order.update({
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
        include: {
          checkout_items: true,
          checkout: {
            include: {
              client: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      });

      const contents = [
        {
          role: "user",
          parts: [
            {
              text: `receipt template: ${receipt_template}`,
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: `order: ${JSON.stringify(order)}`,
            },
          ],
        },
      ];

      const result = await model.generateContent({
        contents,
      });

      const template = result.response.text();

      const email = order.checkout.client.email;

      await sendMail(email, template);
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

    const order = await db.order.findUnique({
      where: {
        tx_reference: ref,
      },
      include: {
        checkout_items: true,
        checkout: {
          include: {
            client: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return new Response("bad");
    }

    // const tx_reference = ref;

    const contents = [
      {
        role: "user",
        parts: [
          {
            text: `receipt template: ${receipt_template}`,
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: `order: ${JSON.stringify(order)}`,
          },
        ],
      },
    ];

    const result = await model.generateContent({
      contents,
    });

    const template = result.response.text();

    await sendMail(order.checkout.client.email, template);

    // const checkout_items_count = await db.checkoutItems.count({
    //   where: {
    //     tx_reference: { not: tx_reference },
    //     paid: false,
    //   },
    // });

    // const payment_status = checkout_items_count > 0 ? "COMPLETED" : "PENDING";

    // const data = await db.order.update({
    //   where: {
    //     tx_reference,
    //   },
    //   data: {
    //     checkout: {
    //       update: {
    //         payment_status: payment_status,
    //       },
    //     },
    //     checkout_items: {
    //       updateMany: {
    //         where: {
    //           tx_reference,
    //         },
    //         data: {
    //           paid: true,
    //         },
    //       },
    //     },
    //   },
    // });

    return Response.json({
      status: true,
      data: order,
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
