import { Submission, User } from "@/types";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { MongoClient, ObjectId } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "";
const JWT_SECRET = process.env.JWT_SECRET || "";

class MongoDatabase {
  private client: MongoClient;
  private dbName = "submission_app";

  constructor() {
    this.client = new MongoClient(MONGODB_URI);
  }

  async connect() {
    await this.client.connect();
    await this.client.db("admin").command({ ping: 1 });
    const db = this.client.db(this.dbName);

    // Seed admin user if not exists
    const admin = await db
      .collection<User>("users")
      .findOne({ username: "admin" });
    if (!admin) {
      await db.collection<User>("users").insertOne({
        _id: new ObjectId(),
        username: "admin",
        password: await bcrypt.hash("admin", 10),
        role: "admin",
      });
    }
  }

  private getUsersCollection() {
    return this.client.db(this.dbName).collection<User>("users");
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return this.getUsersCollection().findOne({ username });
  }

  async createUser(username: string, password: string): Promise<User> {
    const users = this.getUsersCollection();
    const existing = await users.findOne({ username });
    if (existing) {
      throw new Error("Username already exists");
    }
    const user: User = {
      _id: new ObjectId(),
      username,
      password: await bcrypt.hash(password, 10),
      role: "regular",
    };
    await users.insertOne(user);
    return user;
  }

  async login(username: string, password: string): Promise<string | null> {
    const user = await this.findUserByUsername(username);
    if (
      !user ||
      !user.password ||
      !(await bcrypt.compare(password, user.password))
    ) {
      return null;
    }
    const token = jwt.sign(
      { id: user._id.toString(), username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );
    return token;
  }

  private getSubmissionsCollection() {
    return this.client.db(this.dbName).collection<Submission>("submissions");
  }

  async getSubmissions(user: User): Promise<Submission[]> {
    const submissions = this.getSubmissionsCollection();
    if (user.role === "admin") {
      return submissions.find().toArray();
    }
    return submissions.find({ userId: user._id.toString() }).toArray();
  }

  async getSubmissionsPaginated(user: User, skip: number, limit: number) {
    const db = this.client.db(this.dbName);
    const query = user.role === "admin" ? {} : { userId: user._id.toString() };
    return db
      .collection<Submission>("submissions")
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray();
  }

  async getSubmissionById(id: string, user: User): Promise<Submission | null> {
    const submissions = this.getSubmissionsCollection();
    return submissions.findOne({
      _id: new ObjectId(id),
      ...(user.role !== "admin" ? { userId: user._id.toString() } : {}),
    });
  }

  async createSubmission(
    data: Omit<Submission, "_id" | "userId">,
    userId: string
  ): Promise<Submission> {
    const submissions = this.getSubmissionsCollection();
    const submission: Submission = {
      _id: new ObjectId(),
      userId,
      ...data,
    };
    await submissions.insertOne(submission);
    return submission;
  }

  async close() {
    await this.client.close();
  }
}

export const database = new MongoDatabase();
