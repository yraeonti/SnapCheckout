import { db } from "@/lib/db";
import {
  genAI,
  recommendation_sys_instruction,
  model_flash,
} from "@/app/api/gemini";

// const responseSchema: Partial<Store> = {
//   id: "id of product",
//   item_name: "product name",
//   category_id: "category id",
//   item_price: "item price",
//   item_quantity: "quantity",
//   description: string;
//   image: string;
//   user_id: string;
//   created_at: Date;
//   updatedAt: Date;
// }

const model = genAI.getGenerativeModel({
  model: model_flash,
  systemInstruction: recommendation_sys_instruction,
  generationConfig: {
    responseMimeType: "application/json",
  },
});
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const prods = await db.checkout.findFirst({
      where: {
        client: {
          short_link: id,
        },
      },
      include: {
        items: {
          where: {
            paid: true,
          },
        },
      },
    });

    const store = await db.store.findMany({
      where: {
        user_id: prods?.user_id,
      },
    });

    const products = prods?.items || [];

    const prompt = `
      History: ${JSON.stringify(products)}

      Store: ${JSON.stringify(store)}
    `;

    const result = await model.generateContent(prompt);

    const res = JSON.parse(result.response.text());

    return Response.json(res);
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
