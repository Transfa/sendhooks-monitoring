// services/hooksService.ts
import { redisClient } from "../utils/redis";
import { HookModel } from "../models/hookModel";
import { strVal, strValOrUndef } from "@paroi/data-formatters-lib";
import { appLog } from "../share/app-log";
import { appConfig } from "../configuration";

const streamName = appConfig.streamName;
const groupName = "sendhooks-group";

// Define an asynchronous function to start listening for hook events from Redis
export const startHooksListener = async () => {
  // Use the redisClient to read messages from a stream in a Redis consumer group
  await redisClient.xreadgroup(
      "GROUP", // Specify that this is a group read operation
      groupName, // The name of the consumer group
      "hooks-consumer", // Consumer name within the group
      "COUNT", // Option to specify the number of messages to fetch
      0, // Fetch all available messages
      "BLOCK", // Option to block and wait for messages if none are immediately available
      1, // Block for 1ms before timing out if no messages are available
      "STREAMS", // Indicate that the following arguments specify stream names
      streamName, // The name of the stream to read from
      ">", // Special ID meaning "read only messages that have not yet been acknowledged by this consumer"
      (err, streams) => { // Callback function to handle the result of the read operation
        if (err) {
          appLog.error("Error reading stream:", err);
        } else if (streams) {
          // If we successfully read streams, log the raw stream data for debugging
          appLog.debug("streams", streams);  // TODO: to remove
          const [stream] = streams; // Extract the first (and in this case, only) stream from the array

          // Log the detailed information of the stream for debugging
          appLog.debug("streamData", JSON.stringify(stream, null, 2)); // TODO: to remove
          const [messages] = stream as any; // Extract the messages from the stream
          const [message] = messages; // Extract the first message from the messages array
          const [id, data] = message; // Destructure the message to get its ID and data
          const hookData = JSON.parse(data[1]); // Parse the message data (assumed to be JSON) into an object

          // Log the parsed hook data for debugging
          appLog.debug("hookData", hookData); // TODO: to remove
          // Process the hook data (e.g., by creating a new hook based on the data)
          handleHookCreation(id, hookData);
        }
        // Recursively call startHooksListener to continue listening for more messages
        startHooksListener();
      }
  );
};


export const createRedisConsumerGroup = async (): Promise<void> => {
  try {
    await redisClient.xgroup("CREATE", streamName, groupName, "$", "MKSTREAM");
    appLog.info("Consumer group created successfully.");
  } catch (error) {
    appLog.info("Consumer Group name already exists");
  }
};

const handleHookCreation = async (id: string, hookData: any): Promise<void> => {
  try {
    const hook = await HookModel.create({
      id,
      status: strVal(hookData.status),
      created: new Date(strVal(hookData.created)).getTime(),
      error: strValOrUndef(hookData.error),
    });

    appLog.debug("MONGO HOOK", hook); // TODO: to remove
  } catch (error) {
    appLog.error("Error creating hook:", error);
  }
};
