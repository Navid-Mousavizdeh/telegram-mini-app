type User = {
  _id: ObjectId;
  username: string;
  password?: string;
  telegramId?: string;
  role: "admin" | "regular";
};

type Submission = {
  _id: ObjectId;
  userId: string;
  title: string;
  description: string;
  category: "technology" | "education" | "health" | "other";
  imageUrl: string;
};
