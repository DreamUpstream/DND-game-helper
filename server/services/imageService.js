import OpenAI from "openai";
import { OPENAI_API_KEY } from "../config.js";

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export const generateImage = async (req, res) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: "Description is required." });
  }

  try {
    const response = await openai.images.generate({
      model: "dall-e-2",
      prompt: description,
      n: 1,
      size: "1024x1024",
    });
    res.json({ imageUrl: response.data[0].url });
  } catch (error) {
    console.error("Error generating image:", error.message);
    res.status(500).json({ error: error.message });
  }
};
