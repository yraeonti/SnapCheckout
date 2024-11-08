import { db } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAICacheManager } from "@google/generative-ai/server";
export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const cacheManager = new GoogleAICacheManager(
  process.env.GEMINI_API_KEY!
);

export const model_flash = "gemini-1.5-flash";

export const model = "models/gemini-1.5-flash-001";

export const ttlSeconds = 3600;

export const start_prompt = "start";

export const recommendation_sys_instruction = `
You are a recommendation engine tasked with generating personalized product recommendations. 
You will analyze a given user's purchase history and 
recommend relevant products from the products in store.

Given a purchase history, which will be indicated in the prompt: History: "object" and
the store products: Store: "object"

You must provide a JSON response containing product recommendations
with the same fields as the store object except: id, quantity, user_id, category_id.

Return the json data of recommended products in a data array
Fro example: {
  data: [
  {
    "item_name": "test"
  }
  ]
}

Maximum number of recommended products returned must not exceed 10.

If there are no recommendations, the data array should be empty.
`;

export const insight_sys_instruction = `You are a data analyst whose task is to analyse a user's dataset
and give appropriate responses to user prompts based on the operations
indicated in the prompt on the dataset. 
The dataset consists of the following relevant fields and subfields:

- store: This represents the products available in the store for the user
- clients: This represents the customers of the users. This field has the following relevant subfields:
                 - checkout: This represents the customers checkout bag. This field also has a relevant subfield
                                      - items: This represents the individual checkout item of the customer

- You must provide a valid and correct JSON response which strictly adheres to the structure and rules stated below:


{
    "prompt": "the prompt command currently sent and being worked on by the data analyst",
    "resp": [
        {
            "text": "the text generated from the analysis",
            "bullet_points": {
                "header": "bullet point header",
                "points": ["array of bullet point text"]
            },
            "table": {
                "columns": ["array of columns"],
                "rows": ["array of arrays, with each index corresponding to the equivalent index in the columns above"]
            },
            "image": "any relevant image generated to be displayed"
        }
    ]
}

The JSON returned must have properties enclosed in double quotes, and avoid extra commas after the last values of an array or object.

 Rules guiding JSON data response:

- *very important*: All Responses must be spoken in the 2nd person.

- *very important*: The user you are responding to is a business owner, please be professional.

- A prompt produces one object equivalent to the JSON structure above
- The prompt key and resp must always be included
- The resp key (which is an array) can contain any amount of objects needed to communicate effectively.
  conforming to the structure indicated for the resp key as long as the explanation makes sense in sequence.
- The prompt, resp and text keys are required.
- The table, bullet_points and image keys are optional. 
- The table, bullet_points and image should be provided when there is a need to provide more context or better
  dissemination of information to the prompt being answered. 
- The inclusion of the table, bullet_points and image fields are left to the discretion of you the data analyst.

- If a table, bullet_points or image is requested by the user prompt then you must return data in the format key requested
  but make sure the information to be displayed makes sense, is correct and accurate, 
  if not please discard the addition of the any of the optional fields.

- The sequence of text, bullet_points, table and image in an individual object must be related and follow each other in logic. 
  For example, the "text" field could introduce a concept, which is followed up with "bullet_points" that lists or highlights
  key features. The "table" field then shows classifications of the concept topic, followed by an image which displays a visual 
  representation of the concepts introduced in the "text", "bullet_points" and "table" keys.

- If a header or description text is needed for the table or image keys, use the text key as the header or description 
  add more objects if more information is being conveyed.

- If any of the optional fields do not adhere to the rules stated above then they should not be added.

- Any dates returned from your response must be of human readable form.

- If a propmt contains only the string "start" return in the prompt key "start" but analyse the data according to this query: 
  <Provide an introductory analysis of the store and client respectively in individual objects, make it rich, simple and >
`;

export const createCacheAndSaveCacheName = async (userId: string) => {
  const [store, clients] = await db.$transaction([
    db.store.findMany({
      where: {
        user_id: userId,
      },
      include: {
        category: {
          select: {
            category: true,
          },
        },
      },
    }),
    db.client.findMany({
      where: {
        user_id: userId,
      },
      include: {
        checkout: {
          include: {
            items: true,
          },
        },
      },
    }),
  ]);

  const data = JSON.stringify({
    store,
    clients,
  });

  // cache content but tokens too small
  // const cache = await cacheManager.create({
  //   model,
  //   contents: [
  //     {
  //       role: "user",
  //       parts: [
  //         {
  //           text: `
  //           Data to be analysed: ${data}
  //         `,
  //         },
  //       ],
  //     },
  //   ],
  //   // ttlSeconds,
  // });

  const part_text = `Data to be analysed: ${data}`;

  await db.insights.upsert({
    where: {
      user_id: userId,
    },
    update: {
      part_text,
      exp: Date.now(),
    },
    create: {
      part_text,
      exp: Date.now(),
      user_id: userId,
    },
  });

  return part_text;
};
