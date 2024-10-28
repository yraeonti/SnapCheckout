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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;

    if (!id) {
      return Response.json(
        {
          status: false,
          message: "id is required",
        },
        {
          status: 400,
        }
      );
    }

    const form = await req.formData();

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

    if (item_quantity) {
      item_quantity = Number(item_quantity);

      if (typeof item_quantity !== "number") {
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
    } else {
      item_quantity = undefined;
    }

    if (item_price) {
      item_price = Number(item_price);

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
    } else {
      item_price = undefined;
    }

    const options = {
      item_name,
      category_id: category,
      item_price,
      description,
      item_quantity,
      image: undefined as undefined | string,
    };

    for (let i in options) {
      const key = i as keyof typeof options;
      if (options[key] === null || options[key] === undefined) {
        delete options[key];
      }
    }

    if (image) {
      const old_image = await db.store.findUnique({
        where: {
          id,
        },
        select: {
          image: true,
        },
      });

      if (old_image) {
        const public_id = old_image.image
          .split(`${cloudinary_options.folder}/`)[1]
          .split(".")[0];

        console.log("public id", public_id);

        const image_url = await getImageUrl(image);

        if (image_url) {
          const result = await cloudinary.uploader.upload(image_url, {
            ...cloudinary_options,
            public_id,
            overwrite: true,
          });

          options["image"] = result.secure_url;
        }
      }
    }

    await db.store.update({
      where: {
        id,
      },
      data: options,
    });

    return Response.json({
      status: true,
      message: "Product updated",
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

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;

    if (!id) {
      return Response.json(
        {
          status: false,
          message: "id is required",
        },
        {
          status: 400,
        }
      );
    }

    const data = await db.store.findUnique({
      where: {
        id,
      },
      include: {
        category: {
          select: {
            category: true,
          },
        },
      },
    });

    return Response.json({
      status: data ? true : false,
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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;

    if (!id) {
      return Response.json(
        {
          status: false,
          message: "id is required",
        },
        {
          status: 400,
        }
      );
    }

    await db.store.delete({
      where: {
        id,
      },
    });

    return Response.json({
      status: true,
      message: "Product deleted",
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
