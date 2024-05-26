import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { HookModel } from "../models/hookModel";
import request from "supertest";
import express from "express";
import { HookController } from "../controllers/hooksController";

const app = express();
app.get("/hooks", HookController.findAll);
app.get("/hooks/:hookId", HookController.findOne);

describe("Hook Controller Tests", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
      // @ts-ignore
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    app.use(express.json()); // Middleware to parse JSON bodies
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clean up database before each test
    await HookModel.deleteMany({});
  });

  test("findAll should retrieve empty array when no hooks", async () => {
    const response = await request(app).get("/hooks");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("findAll should retrieve all hooks", async () => {
    const hook = new HookModel({
      id: "1",
      url: "http://example.com",
      status: "success",
      created: new Date(),
    });
    await hook.save();

    const response = await request(app).get("/hooks");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].id).toBe(hook.id);
  });

  test("findOne should return 404 if hook not found", async () => {
    const response = await request(app).get("/hooks/unknownHookId");
    expect(response.status).toBe(404);
    expect(response.body.code).toBe("INVALID_ID");
  });

  test("findOne should retrieve specific hook by id", async () => {
    const hook = new HookModel({
      id: "1",
      url: "http://example.com",
      status: "success",
      created: new Date(),
    });
    await hook.save();

    const response = await request(app).get(`/hooks/${hook._id}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(hook.id);
  });
});
