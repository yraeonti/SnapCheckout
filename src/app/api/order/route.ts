import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ORDER_STATUS } from "@prisma/client";

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
    const { checkout_items, checkout_id, tx_reference } = await req.json();

    console.log("user id", userId);

    if (!checkout_id) {
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

    if (!Array.isArray(checkout_items)) {
      return Response.json(
        {
          status: false,
          message: "order_items is an array of checkout items",
        },
        {
          status: 400,
        }
      );
    }

    if (!(checkout_items.length > 0)) {
      return Response.json(
        {
          status: false,
          message: "order_items cannot be empty",
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

    const order = await db.order.create({
      data: {
        checkout_id,
        tx_reference,
        checkout_items: {
          connect: checkout_items,
        },
      },
    });

    return Response.json({
      status: true,
      message: "order has been created",
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

export async function GET(req: Request) {
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
    const data = await db.order.findMany({
      where: {
        checkout: {
          user_id: userId,
        },
      },
      include: {
        checkout_items: true,
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

export async function PATCH(req: Request) {
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
    const { order_id, status } = await req.json();

    if (!status) {
      return Response.json(
        {
          status: false,
          message: "status is required",
        },
        {
          status: 400,
        }
      );
    }

    if (
      status !== ORDER_STATUS.COMPLETED ||
      status !== ORDER_STATUS.FAILED ||
      status !== ORDER_STATUS.ONGOING ||
      status !== ORDER_STATUS.PENDING
    ) {
      return Response.json(
        {
          status: false,
          message: "status is not valid",
        },
        {
          status: 400,
        }
      );
    }

    await db.order.update({
      where: {
        id: order_id,
      },
      data: {
        status,
      },
    });

    return Response.json({
      status: true,
      message: "order status updated",
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
