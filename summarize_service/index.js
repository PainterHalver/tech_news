const { GoogleGenerativeAI, BlockReason, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv')

dotenv.config();
process.env.GOOGLE_APPLICATION_CREDENTIALS = './service-account.json';

// Initialize Vertex with your Cloud project and location
const model = 'gemini-1.0-pro-001';
const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Instantiate the models
const generativeModel = genAI.getGenerativeModel({
  model: model,
  generationConfig: {
    "max_output_tokens": 768,
    "temperature": 0.2,
    "top_p": 0.8,
    "top_k": 40
  },
  safetySettings: [
    {
      'category': HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      'threshold': HarmBlockThreshold.BLOCK_NONE,
    },
    {
      'category': HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      'threshold': HarmBlockThreshold.BLOCK_NONE,
    },
    {
      'category': HarmCategory.HARM_CATEGORY_HARASSMENT,
      'threshold': HarmBlockThreshold.BLOCK_NONE,
    },
    {
      'category': HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      'threshold': HarmBlockThreshold.BLOCK_NONE,
    },
  ],
});

async function generateContent(content) {
  const req = {
    contents: [
      { role: 'user', parts: [{ text: "Nhiệm vụ của bạn là tóm tắt các tin tức sau bằng tiếng Việt trong dưới 150 từ. Bạn sẽ tránh dùng thuật ngữ phức tạp và giải thích một cách dễ hiểu nhất. Nội dung tin tức: " + JSON.stringify(content) }] },
    ],
  };

  const response = await generativeModel.generateContentStream(req);
  let result = "";
  for await (const item of response.stream) {
    if (item.candidates[0].finishReason === 'SAFETY') {
      throw new Error(`Safety block error: ${JSON.stringify(item)}}`);
    } else {
      result += item.candidates[0].content.parts.map(part => part.text).join("\n");
    }
  }

  // const result = response.response.candidates[0].content.parts.map(part => part.text).join("\n");
  return result;
};

const sendTelegramMessage = async (message) => {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
  }
};


const main = async () => {
  let db;
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST || "127.0.0.1",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "root",
      database: process.env.DB_NAME || "tech_news",
    })

    // MAIN LOOP
    let retry = 0;
    while (true) {
      try {
        // get the first post that has not been generated
        const [rows, _] = await db.query("SELECT * FROM posts WHERE description_generated IS NULL LIMIT 1");
        if (rows.length === 0) {
          break;
        }

        // if content has less than 150 words, skip
        if (rows[0].content.split(" ").length < 150) {
          await db.query("UPDATE posts SET description_generated = ? WHERE id = ?", ["Bài viết có độ dài dưới 150 từ", rows[0].id]);
          throw new Error("Content too short, less than 150 words, id: " + rows[0].id);
        }

        // Generate summary
        const summary = await generateContent(rows[0].content);

        // Update database
        await db.query("UPDATE posts SET description_generated = ? WHERE id = ?", [summary, rows[0].id]);

        console.log(`Updated post ${rows[0].id}`);
        retry = 0
      } catch (error) {
        console.log("LOOP ERROR: ", error)
        retry++
        if (retry > 10) {
          throw new Error("Too many retries, exiting...");
        }

        if (typeof error === "VertexAI.ClientError") {
          console.log("VertexAI.ClientError, waiting 10 seconds before continue...");
          await new Promise(resolve => setTimeout(resolve, 10000));
        }
      } finally {
        // wait 3 seconds before continue
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    console.log("Done! No more posts to generate, exiting...");
  } catch (error) {
    sendTelegramMessage("Summarizer Error: " + JSON.stringify(error, null, 2));
    console.log("MAIN ERROR: ", error);
  } finally {
    await db.end();
  }
}

main()
