import { envsafe, str, port } from "envsafe";
import dotenv from "dotenv";

dotenv.config();

export const env = envsafe({
  DATABASE_URL: str(),
  JWT_SECRET: str(),
  PORT: port({ default: 3000 }),
  OPENAI_API_KEY: str({
    input: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY
  }),
});