import { db } from "@/lib/db";
import { generateHash } from "@/lib/utils";
import { validate } from "email-validator";
import { auth, createClerkClient } from "@clerk/nextjs/server";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId, email } = await req.json();

    if (!userId || !email) {
      return Response.json(
        {
          status: false,
          message: "userId and email are required",
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
          message: "Please provide valid email",
        },
        {
          status: 400,
        }
      );
    }

    const user = await clerkClient.users.getUser(userId);

    if (!user.primaryEmailAddress?.emailAddress) {
      return Response.json(
        {
          status: false,
          message: "user does not exist",
        },
        {
          status: 400,
        }
      );
    }

    const { short_hash } = generateHash(email, userId, new Date());

    await db.profileSettings.create({
      data: {
        user_id: userId,
        client_link: short_hash,
      },
    });

    return new Response("ok");
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
    const user = await clerkClient.users.getUser(userId);

    if (!user.primaryEmailAddress?.emailAddress) {
      return Response.json(
        {
          status: false,
          message: "user does not exist",
        },
        {
          status: 400,
        }
      );
    }

    const { short_hash } = generateHash(
      user.primaryEmailAddress.emailAddress,
      userId,
      new Date()
    );

    await db.profileSettings.upsert({
      where: {
        user_id: userId,
      },
      create: {
        client_link: short_hash,
        user_id: userId,
      },
      update: {
        client_link: short_hash,
      },
    });
    return Response.json({
      status: true,
      data: "your client link is updated",
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
