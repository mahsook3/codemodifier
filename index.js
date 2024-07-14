import express from 'express';
import bodyParser from 'body-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';

const app = express();
const port = 4000;

const genAI = new GoogleGenerativeAI("AIzaSyBBE3XC7t5HAuKD-9Ny4aa1TTTfQCvjsgA");

// Use cors middleware to enable CORS
app.use(cors());
app.use(bodyParser.json());

app.post('/generate', async (req, res) => {
  const { html, company, goal, keywords, color } = req.body;

  const prompt = `Rewrite a given HTML code to have content that promotes ${company} as a solution for ${goal}. The content should include the following keywords: ${keywords};
  here is the HTML code to rewrite and match the given color "${color}" replace any extra color with given color: ${html}
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    // Regular expression to match content between ```html and ```
    const regex = /```html([\s\S]*?)```/;
    const match = text.match(regex);

    // Check if there's a match and extract the content
    const htmlContent = match ? match[1].trim() : 'No HTML content found';

    // Send the extracted content as JSON
    res.json({ html: htmlContent });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while generating content');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
