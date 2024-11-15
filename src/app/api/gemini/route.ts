import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {
  genAI,
  insight_sys_instruction,
  createCacheAndSaveCacheName,
  model_flash,
  start_prompt,
} from "../gemini";

const model = genAI.getGenerativeModel({
  model: model_flash,
  systemInstruction: insight_sys_instruction,
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.4,
    // topK: 8,
    // topP: 0.5,
  },
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
    const { text } = await req.json();

    if (!text) {
      return Response.json(
        {
          status: false,
          message: "text is required",
        },
        {
          status: 401,
        }
      );
    }

    let part_text: string | undefined;

    const insight = await db.insights.findUnique({
      where: {
        user_id: userId,
      },
    });

    part_text = insight?.part_text;

    if (!part_text || !insight) {
      part_text = await createCacheAndSaveCacheName(userId);
    }

    const content = [
      {
        role: "user",
        parts: [
          {
            text: part_text,
          },
        ],
      },
    ];

    if (insight?.last_message && insight.last_response) {
      content.push({
        role: "user",
        parts: [
          {
            text: insight.last_message,
          },
        ],
      });
      content.push({
        role: "model",
        parts: [
          {
            text: insight.last_response,
          },
        ],
      });
    }

    const chatSession = model.startChat({
      history: content,
    });

    const message = await chatSession.sendMessage(text);

    const res = JSON.parse(message.response.text());

    await db.insights.update({
      where: {
        user_id: userId,
      },
      data: {
        last_message: text,
        last_response: message.response.text(),
      },
    });

    return Response.json({
      status: true,
      data: res,
    });
  } catch (error: any) {
    console.log(error.message);

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
    let part_text: string | undefined;

    const insight = await db.insights.findUnique({
      where: {
        user_id: userId,
      },
    });

    part_text = insight?.part_text;

    if (!part_text || !insight) {
      part_text = await createCacheAndSaveCacheName(userId);
    }

    const content = [
      {
        role: "user",
        parts: [
          {
            text: part_text,
          },
        ],
      },
    ];

    const chatSession = model.startChat({
      history: content,
    });

    const data = [];

    const message = await chatSession.sendMessage(start_prompt);

    const res = JSON.parse(message.response.text());

    data.push(res);

    if (insight?.last_response) {
      const last_res = JSON.parse(insight.last_response);
      data.push(last_res);
    }

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
