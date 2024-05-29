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

const cors = require("cors");

async function main() {
  // Connect to MongoDB at the start
  await connectToMongoDB();

  // Middleware to parse JSON bodies in incoming requests
  app.use(express.json());

  const allowedOrigins = appConfig.allowedOrigins.split(",");

  // Custom CORS configuration
  const corsOptions = {
    origin: (origin: string, callback: any) => {
      // Check if the origin is in the allowed origins array
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
  };

  // Enable CORS with custom options
  app.use(cors(corsOptions));

  // Set up the routes for the /api/sendhooks/v1 endpoint
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
