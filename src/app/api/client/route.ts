import { auth } from "@clerk/nextjs/server";
import validator from "email-validator";
import { generateHash } from "@/lib/utils";
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
    const { email, phone, name } = await req.json();

    if (!email) {
      return Response.json(
        {
          status: false,
          message: "email is required",
        },
        {
          status: 400,
        }
      );
    }

    const validate = validator.validate(email);

    if (!validate) {
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

    const cust = await db.client.findFirst({
      where: {
        user_id: userId,
        email,
      },
    });

    if (cust) {
      return Response.json(
        {
          message: "Client already added",
          staus: false,
        },
        {
          status: 400,
        }
      );
    }

    const { hash, short_hash } = generateHash(email, userId, new Date());

    const options = {
      email,
      phone,
      name,
      link: hash,
      short_link: short_hash,
      user_id: userId,
    };

    if (!phone) {
      delete options.phone;
    }

    if (!name) {
      delete options.name;
    }

    await db.$transaction(async (tx) => {
      const client = await tx.client.create({
        data: options,
      });

      if (!client) {
        throw new Error("Client not created successfully");
      }

      await tx.checkout.create({
        data: { user_id: userId, client_id: client.id },
      });
    });

    return Response.json({
      status: true,
      message: "Client created",
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
    const data = await db.client.findMany({
      where: {
        user_id: userId,
      },
      include: {
        checkout: {
          include: {
            items: {
              where: {
                paid: false,
              },
            },
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
