import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { checkout_id } = await req.json();

    await db.checkout.update({
      where: {
        id: checkout_id,
      },
      data: {
        payment_status: "ONGOING",
      },
    });

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
