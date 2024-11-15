import { auth } from "@clerk/nextjs/server";
import { IStore } from "@/types/store.dto";
import { db } from "@/lib/db";
import cloudipack from "cloudinary";
import { getImageUrl } from "@/lib/utils";
import { cloudinary_options } from "@/lib/utils";

const cloudinary = cloudipack.v2;

cloudinary.config({
  secure: true,
});

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
    const form = await req.formData();
    // const {
    //   item_name,
    //   category,
    //   item_price,
    //   item_quantity,
    //   description,
    //   image
    // }: IStore = await req.json();

    const item_name = form.get("item_name")?.toString();
    const category = form.get("category_id")?.toString();
    let item_price: string | number | undefined = form
      .get("item_price")
      ?.toString();
    const description = form.get("description")?.toString();
    const image = form.get("image") as Blob | null;
    let item_quantity: string | number | undefined = form
      .get("item_quantity")
      ?.toString();

    if (
      !item_name ||
      !category ||
      !item_price ||
      !description ||
      !item_quantity
    ) {
      return Response.json(
        {
          status: false,
          message: "All fields are required",
        },
        {
          status: 400,
        }
      );
    }

    item_quantity = Number(item_quantity);

    item_price = Number(item_price);

    if (typeof item_quantity !== "number" || item_quantity < 0) {
      return Response.json(
        {
          status: false,
          message: "item_quantity should be a number, 0 and above",
        },
        {
          status: 400,
        }
      );
    }

    if (typeof item_price !== "number") {
      return Response.json(
        {
          status: false,
          message: "item_price is not a valid number",
        },
        {
          status: 400,
        }
      );
    }

    const image_url = await getImageUrl(image);

    if (!image_url) {
      return Response.json(
        {
          message: "Image is required",
        },
        {
          status: 400,
        }
      );
    }

    const result = await cloudinary.uploader.upload(
      image_url,
      cloudinary_options
    );

    console.log(result);

    const options = {
      item_name,
      category_id: category,
      item_price,
      item_quantity,
      description,
      user_id: userId,
      image: result.secure_url,
    };

    await db.store.create({
      data: options,
    });

    return Response.json({
      status: true,
      message: "Product created",
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
    const data = await db.store.findMany({
      where: {
        user_id: userId,
        deletedAt: { isSet: false },
      },
      include: {
        category: {
          select: {
            category: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
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
