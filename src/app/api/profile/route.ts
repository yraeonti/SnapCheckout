import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import cloudipack from "cloudinary";
import { getImageUrl } from "@/lib/utils";
import { cloudinary_options } from "@/lib/utils";
import { ProfileSettings } from "@prisma/client";

const cloudinary = cloudipack.v2;

cloudinary.config({
  secure: true,
});

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
    const profile = await db.profileSettings.findUnique({
      where: {
        user_id: userId,
      },
    });
    return Response.json({
      status: true,
      data: profile,
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
    const form = await req.formData();

    const instagram = form.get("instagram")?.toString();
    const twitter = form.get("twitter")?.toString();
    const facebook = form.get("facebook")?.toString();
    const account_name = form.get("account_name")?.toString();
    const account_number = form.get("account_number")?.toString();
    const bank_name = form.get("bank_name")?.toString();
    const brand_name = form.get("brand_name")?.toString();
    const brand_logo = form.get("brand_logo") as Blob | null;

    const options = {
      social_links: {
        instagram,
        twitter,
        facebook,
      },
      brand_details: {
        brand_name,
        brand_logo: undefined as undefined | string,
      },
      account_details: {
        account_name,
        account_number,
        bank_name,
      },
    };

    const socials = options.social_links;
    for (let i in socials) {
      const key = i as keyof typeof socials;
      if (socials[key] === null || socials[key] === undefined) {
        delete socials[key];
      }
    }

    const brand = options.brand_details;
    for (let i in brand) {
      const key = i as keyof typeof brand;
      if (brand[key] === null || brand[key] === undefined) {
        delete brand[key];
      }
    }

    const account = options.account_details;
    for (let i in account) {
      const key = i as keyof typeof account;
      if (account[key] === null || account[key] === undefined) {
        delete account[key];
      }
    }

    for (let i in options) {
      const key = i as keyof typeof options;
      if (Object.values(options[key]).length == 0) {
        delete options[key];
      }
    }

    if (brand_logo) {
      const old_logo = await db.profileSettings.findUnique({
        where: {
          user_id: userId,
        },
        select: {
          brand_details: {
            select: {
              brand_logo: true,
            },
          },
        },
      });

      const image_url = await getImageUrl(brand_logo);
      // console.log("brand logs 2222222", image_url);
      if (old_logo?.brand_details?.brand_logo) {
        const public_id = old_logo.brand_details?.brand_logo
          .split(`${cloudinary_options.folder}/`)[1]
          .split(".")[0];

        if (image_url) {
          const result = await cloudinary.uploader.upload(image_url, {
            ...cloudinary_options,
            public_id,
            overwrite: true,
          });

          options["brand_details"] = {
            ...options["brand_details"],
            brand_logo: result.secure_url,
          };
        }
      }

      if (image_url) {
        const result = await cloudinary.uploader.upload(
          image_url,
          cloudinary_options
        );

        options["brand_details"] = {
          ...options["brand_details"],
          brand_logo: result.secure_url,
        };
      }
    }

    await db.profileSettings.upsert({
      where: {
        user_id: userId,
      },
      create: { ...options, user_id: userId } as any as ProfileSettings,
      update: options as any as ProfileSettings,
    });

    return Response.json({
      status: true,
      message: "profile updated",
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
