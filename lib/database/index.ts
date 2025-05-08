import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

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

  async close() {
    await this.client.close();
  }
}

export const database = new MongoDatabase();
