import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { Hook, HookModel } from "../models/hookModel";

describe("Hook Model Tests", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    // Create instance of MongoMemoryServer
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Connect to the in-memory database
    await mongoose.connect(mongoUri, {
      // @ts-ignore
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Disconnect and stop in-memory database
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  test("Successfully create a hook", async () => {
    const hookData: Partial<Hook> = {
      id: "1",
      url: "http://example.com",
      status: "success",
      created: new Date(),
    };

    const hook = new HookModel(hookData);
    await hook.save();

    // Assertions
    expect(hook.id).toBe(hookData.id);
    expect(hook.url).toBe(hookData.url);
    expect(hook.status).toBe(hookData.status);
    expect(hook.created).toBeDefined();
  });

  test("Fail to create a hook without required fields", async () => {
    const hookData = {
      status: "success",
    };

    // Ensuring the test expects a Promise rejection (e.g., due to validation errors)
    await expect(
      new HookModel(hookData as Partial<Hook>).save(),
    ).rejects.toThrow();
  });

  test("Handle optional fields correctly", async () => {
    const hookData: Partial<Hook> = {
      id: "2",
      url: "http://example.com",
      status: "failed",
      created: new Date(),
      delivered: new Date(),
      error: "Timeout",
      external_id: "123abc",
    };

    const hook = new HookModel(hookData);
    await hook.save();

    // Assertions
    expect(hook.delivered).toBeDefined();
    expect(hook.error).toBe(hookData.error);
    expect(hook.external_id).toBe(hookData.external_id);
  });

  // Additional tests can be added here
});
