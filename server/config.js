import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const FRONTEND_TESTING = process.env.FRONTEND_TESTING === "true";
export const PORT = process.env.PORT || 3001;
export const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/dnd";
export const SECRET_KEY = process.env.SECRET_KEY || "defaultsecret";
