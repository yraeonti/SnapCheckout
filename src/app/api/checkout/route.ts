import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return Response.json(
      {
        status: false,
        message: "User not authenticated",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const { product_id, quantity, client_id } = await req.json();

    if (!product_id || !quantity || !client_id) {
      return Response.json(
        {
          status: false,
          message: "product_id, quantity, client_id are required",
        },
        {
          status: 400,
        }
      );
    }

    if (typeof quantity !== "number") {
      return Response.json(
        {
          status: false,
          message: "quantity is not of type number",
        },
        {
          status: 400,
        }
      );
    }

    if (quantity < 1) {
      return Response.json(
        {
          status: false,
          message: "quantity cannot be less than 1",
        },
        {
          status: 400,
        }
      );
    }

    const product = await db.store.findUnique({
      where: {
        id: product_id,
        user_id: userId,
      },
    });

    if (!product) {
      return Response.json(
        {
          status: false,
          message: "Product does not exist",
        },
        {
          status: 400,
        }
      );
    }

    if (quantity > product.item_quantity) {
      return Response.json(
        {
          status: false,
          message: "quantity is greater than product quantity in store",
        },
        {
          status: 400,
        }
      );
    }

    const options = {
      item_name: product.item_name,
      image: product.image,
      item_price: product.item_price,
      description: product.description,
      quantity,
    };

    await db.$transaction([
      db.store.update({
        where: {
          id: product_id,
          user_id: userId,
        },
        data: {
          item_quantity: {
            decrement: quantity,
          },
        },
      }),

      db.checkout.update({
        where: {
          user_id: userId,
          client_id,
        },
        data: {
          payment_status: "PENDING",
        },
      }),

      db.checkoutItems.create({
        data: {
          ...options,
          product: {
            connect: { id: product_id },
          },
          checkout: {
            connect: { client_id, user_id: userId },
          },
        },
      }),
    ]);

    return Response.json({
      status: true,
      message: "Product added to checkout",
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
