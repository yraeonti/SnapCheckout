import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { short_link, product_id, quantity } = await req.json();

    if (!short_link || !product_id) {
      return Response.json(
        {
          status: false,
          message: "short_link and product_id required",
        },
        {
          status: 400,
        }
      );
    }

    if (typeof quantity != "number") {
      return Response.json(
        {
          status: false,
          message: "provide valid quantity",
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

    const client = await db.client.findUnique({
      where: {
        short_link,
      },
    });

    if (!client) {
      console.log("cleint does not exist");
      throw new Error("Something went wrong");
    }

    const product = await db.store.findUnique({
      where: {
        id: product_id,
        user_id: client.user_id,
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
          user_id: client.user_id,
        },
        data: {
          item_quantity: {
            decrement: quantity,
          },
        },
      }),

      db.checkout.update({
        where: {
          user_id: client.user_id,
          client_id: client.id,
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
            connect: { client_id: client.id, user_id: client.user_id },
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

export async function DELETE(req: Request) {
  try {
    const { checkout_item_id } = await req.json();

    if (!checkout_item_id) {
      return Response.json(
        {
          status: false,
          message: "checkout_id is required",
        },
        {
          status: 400,
        }
      );
    }

    const item = await db.checkoutItems.findUnique({
      where: {
        id: checkout_item_id,
      },
      include: {
        product: {
          select: {
            user_id: true,
          },
        },
      },
    });

    if (!item) {
      return Response.json(
        {
          status: false,
          message: "item does not exist",
        },
        {
          status: 400,
        }
      );
    }

    await db.store.update({
      where: {
        id: item.product_id,
        user_id: item.product.user_id,
      },
      data: {
        item_quantity: {
          increment: item.quantity,
        },
        checkoutItem: {
          delete: {
            id: checkout_item_id,
          },
        },
      },
    });

    return Response.json({
      status: true,
      message: "Product removed from checkout",
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

export async function PATCH(req: Request) {
  try {
    const { short_link, location } = await req.json();

    if (!short_link || !location) {
      return Response.json(
        {
          status: false,
          message: "only location can be updated",
        },
        {
          status: 400,
        }
      );
    }

    const client = await db.client.findUnique({
      where: {
        short_link,
      },
    });

    if (!client) {
      console.log("no client");

      throw new Error();
    }

    await db.client.update({
      where: {
        short_link,
      },
      data: {
        location,
      },
    });

    return Response.json({
      status: true,
      message: "location updated",
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
