import { auth } from "@clerk/nextjs/server";
import { createCacheAndSaveCacheName } from "../../gemini";

export async function GET() {
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
    await createCacheAndSaveCacheName(userId);

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
