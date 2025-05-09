import { ObjectId } from "mongodb";

export interface User {
  _id: ObjectId;
  username: string;
  password?: string;
  telegramId?: string;
  role: "admin" | "regular";
}

export interface Submission {
  _id: ObjectId;
  userId: string;
  title: string;
  description: string;
  category: "technology" | "education" | "health" | "other";
  imageUrl: string;
}
