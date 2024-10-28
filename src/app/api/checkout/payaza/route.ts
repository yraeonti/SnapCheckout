export async function POST(req: Request) {
  try {
    const data = await req.json();

    console.log("webhook data", data);

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
