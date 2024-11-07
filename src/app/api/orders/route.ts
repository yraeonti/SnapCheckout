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
    const { order_items } = await req.json();

    if (!Array.isArray(order_items)) {
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

    await db.order.create({
      data: {
        order_items,
        user_id: userId,
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
        user_id: userId,
      },
      select: {
        id: true,
        status: true,
        user_id: true,
        order_items: {
          select: {
            checkout_item_id: true,
          },
        },
        created_at: true,
        updatedAt: true,
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
        user_id: userId,
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
