import express from "express";
import { connectToMongoDB } from "./src/utils/mongoDB";
import {
  createRedisConsumerGroup,
  startHooksListener,
} from "./src/services/hooksService";
import hooksRoutes from "./src/routes/hooksRoutes";
import { appConfig } from "./src/configuration";
import { appLog } from "./src/share/app-log";

const app = express();

async function main() {
  // Connect to MongoDB at the start
  await connectToMongoDB();

  // Middleware to parse JSON bodies in incoming requests
  app.use(express.json());

  // Setup the routes for the /api/sendhooks/v1 endpoint
  app.use("/api/sendhooks/v1", hooksRoutes);

  // Initialize the Redis consumer group for processing hooks
  await createRedisConsumerGroup();

  // Start listening for hooks on Redis
  await startHooksListener();

  app.listen(appConfig.thisServer.port, () => {
    appLog.info(`Server is running on port ${appConfig.thisServer.port}`);
  });
}

main().catch(appLog.error);
