import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { validate } from "email-validator";

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
    const { email, name, phone, location } = await req.json();

    const { id } = await params;

    const options = {
      email,
      name,
      phone,
      location,
    };

    if (!options.email) delete options.email;

    if (!options.name) delete options.name;

    if (!options.phone) delete options.phone;

    if (!options.location) delete options.location;

    if (email) {
      if (!validate(email)) {
        return Response.json(
          {
            message: "Email not valid",
            status: false,
          },
          {
            status: 400,
          }
        );
      }
    }

    await db.client.update({
      where: {
        user_id: userId,
        id,
      },
      data: options,
    });

    return Response.json({
      status: true,
      message: "Client updated",
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

    await db.client.update({
      where: {
        user_id: userId,
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return Response.json({
      status: true,
      message: "Client deleted",
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
