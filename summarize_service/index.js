const { VertexAI } = require('@google-cloud/vertexai');
const mysql = require('mysql2/promise');

process.env.GOOGLE_APPLICATION_CREDENTIALS = './service-account.json';

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({ project: 'my-gcp-project-413702', location: 'asia-southeast1' });
const model = 'gemini-pro';

// Instantiate the models
const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generation_config: {
    "max_output_tokens": 768,
    "temperature": 0,
    "top_p": 0.1,
    "top_k": 40
  },
});

async function generateContent(content) {
  const req = {
    contents: [
      { role: 'user', parts: [{ text: "Nhiệm vụ của bạn là tóm tắt các tin tức sau bằng tiếng Việt trong dưới 150 từ. Bạn sẽ tránh dùng thuật ngữ phức tạp và giải thích một cách dễ hiểu nhất. Bạn sẽ chỉ trả lời bằng một hoặc vài đoạn văn bản." }] },
      { role: 'model', parts: [{ text: "Tôi đã hiểu, hãy gửi nội dung tin tức." }] },
      { role: 'user', parts: [{ text: content }] },
    ],
  };

  const response = await generativeModel.generateContent(req);

  const result = response.response.candidates[0].content.parts.map(part => part.text).join("\n");
  return result;
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
    console.log("MAIN ERROR: ", error);
  } finally {
    await db.end();
  }
}

main()
