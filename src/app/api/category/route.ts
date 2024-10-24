import { auth } from "@clerk/nextjs/server";
import { IStore } from "@/types/store.dto";
import { db } from "@/lib/db";

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
    const { category } = await req.json();

    if (!category) {
      return Response.json(
        {
          status: false,
          message: "category field is required",
        },
        {
          status: 400,
        }
      );
    }

    await db.category.create({
      data: {
        category,
      },
    });

    return Response.json({
      status: true,
      message: "Category created",
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
  try {
    const data = await db.category.findMany();

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
