import { db } from "@/lib/db";
import { generateHash } from "@/lib/utils";
import { Client } from "@prisma/client";
import { validate } from "email-validator";

export async function POST(req: Request) {
  try {
    const { email, name, location, client_link, phone } = await req.json();

    if (!email || !client_link) {
      return Response.json(
        {
          status: false,
          message: "email,client_link and location are required",
        },
        {
          status: 400,
        }
      );
    }

    if (!validate(email)) {
      return Response.json(
        {
          status: false,
          message: "email is not valid",
        },
        {
          status: 400,
        }
      );
    }

    const user = await db.profileSettings.findUnique({
      where: {
        client_link,
      },
    });

    if (!user) {
      console.log("no user");

      throw new Error("user does not exist");
    }

    let client;

    client = await db.client.findFirst({
      where: {
        email,
        user_id: user.user_id,
      },
    });

    if (!client) {
      console.log("got here");

      const { hash, short_hash } = generateHash(
        email,
        user.user_id,
        new Date()
      );

      const options = {
        email,
        phone,
        name,
        location,
        link: hash,
        short_link: short_hash,
        user_id: user.user_id,
      };

      if (!phone) {
        delete options.phone;
      }

      if (!name) {
        delete options.name;
      }

      if (!location) {
        delete options.location;
      }

      await db.$transaction(async (tx) => {
        client = await tx.client.create({
          data: options,
        });

        if (!client) {
          throw new Error("Client not created successfully");
        }

        await tx.checkout.create({
          data: { user_id: user.user_id, client_id: client.id },
        });
      });
    }

    return Response.json({
      status: true,
      data: client,
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
