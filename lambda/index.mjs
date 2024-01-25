// 1. Create a google cloud service account (to allow Server to Server authentication)
// Flow: Function uses service account to request access token -> call google api
// https://developers.google.com/identity/protocols/oauth2/service-account
// Add service account file service-account.json (key)

// 2. Install dependencies
// npm install

// 3. Zip the folder and upload to AWS Lambda

// 4. Settings:
// Node.js 20.x
// Batch size: 1

import { VertexAI } from '@google-cloud/vertexai';
import mysql from 'mysql2/promise';

process.env.GOOGLE_APPLICATION_CREDENTIALS = './service-account.json';

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({ project: 'essential-oven-403504', location: 'asia-southeast1' });
const model = 'gemini-pro';

// Instantiate the models
const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generation_config: {
    "max_output_tokens": 768,
    "temperature": 0.2,
    "top_p": 0.8,
    "top_k": 40
  },
});

async function generateContent() {
  const req = {
    contents: [{ role: 'user', parts: [{ text: "tell me a random number" }] }],
  };

  const response = await generativeModel.generateContent(req);

  const content = response.response.candidates[0].content.parts.map(part => part.text).join("\n");
  return content;
};

export const handler = async (event, context) => {
  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME || "tech_news",
    })

    let ids = event.Records.map(record => JSON.parse(record.body)).flat();
    for (const id of ids) {
      // Check if generated content already exists
      const [rows, _] = await db.query("SELECT description_generated FROM posts WHERE id = ?", [id]);
      if (rows[0].description_generated) continue;

      // Generate content
      const content = await generateContent();

      // Update database
      await db.query("UPDATE posts SET description_generated = ? WHERE id = ?", [content, id]);

      console.log(`Updated post ${id}`);
    }

    return {
      statusCode: 200,
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
}

/*
SQS Event Example
{
  "Records": [
    {
      "messageId": "19dd0b57-b21e-4ac1-bd88-01bbb068cb78",
      "receiptHandle": "MessageReceiptHandle",
      "body": "[12, 34, 56, 78]",
      "attributes": {
        "ApproximateReceiveCount": "1",
        "SentTimestamp": "1523232000000",
        "SenderId": "123456789012",
        "ApproximateFirstReceiveTimestamp": "1523232000001"
      },
      "messageAttributes": {},
      "md5OfBody": "{{{md5_of_body}}}",
      "eventSource": "aws:sqs",
      "eventSourceARN": "arn:aws:sqs:ap-southeast-1:123456789012:MyQueue",
      "awsRegion": "ap-southeast-1"
    }
  ]
}
*/
