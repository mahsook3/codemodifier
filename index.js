import express from "express";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from "cors";

const app = express();
const port = 4000;

const genAI = new GoogleGenerativeAI("AIzaSyBBE3XC7t5HAuKD-9Ny4aa1TTTfQCvjsgA");

app.use(cors());
app.use(bodyParser.json());

app.post("/generate", async (req, res) => {
  const { html, company, goal, keywords, color } = req.body;

  const prompt = `Rewrite a given HTML code to have content that promotes ${company} as a solution for ${goal}. The content should include the following keywords: ${keywords} and theme should match with ${color} like bg-[${color}] or text-bg-[${color}] if required also replace icon with fontawesome.com icons : ${html}
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    const regex = /```html([\s\S]*?)```/;
    const match = text.match(regex);

    const htmlContent = match ? match[1].trim() : "No HTML content found";

    res.json({ html: htmlContent });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while generating content");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
