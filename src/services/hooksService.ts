// services/hooksService.ts
import { redisClient } from "../utils/redis";
import { HookModel } from "../models/hookModel";
import { strVal, strValOrUndef } from "@paroi/data-formatters-lib";
import { appLog } from "../share/app-log";
import { appConfig } from "../configuration";

const streamName = appConfig.streamName;
const groupName = "sendhooks-group";

/**
 * Starts listening for new hook messages from a Redis stream using a consumer group.
 * Upon receiving a message, it parses and processes the hook data, then logs the information.
 * This function implements a recursive pattern to ensure it continues listening for
 * messages indefinitely. If an error occurs during message retrieval or processing,
 * it logs the error and continues to listen for more messages.
 *
 * The function uses the `xreadgroup` command from the Redis client to read messages
 * targeted for a specific group and consumer, ensuring that each message is processed
 * once by the service. It automatically retries listening upon successful processing
 * of a message or encountering an error, making it robust against transient failures.
 *
 * @returns {Promise<void>} A promise that resolves when the listener starts. The promise
 *                          does not settle under normal operation as the function is
 *                          designed to run indefinitely or until an unhandled error occurs.
 */
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
    (err, streams) => {
      // Callback function to handle the result of the read operation
      if (err) {
        appLog.error("Error reading stream:", err);
      } else if (streams) {
        // If we successfully read streams, log the raw stream data for debugging
        appLog.debug("streams", streams); // TODO: to remove
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
    },
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

/**
 * Asynchronously creates a new hook in the database. It parses the hook data
 * received, including status and potential error information, and logs the
 * creation process. If the operation fails, it catches and logs the error.
 *
 * @param {string} id - The unique identifier for the hook to be created.
 * @param {any} hookData - The data associated with the hook, expected to contain
 *                         status, created date, and potentially an error message.
 *                         The exact structure of this data is determined by the
 *                         incoming webhook payload.
 * @returns {Promise<void>} A promise that resolves with no value, indicating the
 *                          hook has been created successfully or an error has
 *                          been logged.
 */
const handleHookCreation = async (id: string, hookData: any): Promise<void> => {
  try {
    // Attempt to create a new hook record in the database using the HookModel.
    // The model's create method is passed an object containing the new hook's properties.
    const hook = await HookModel.create({
      id, // Set the hook's ID from the parameter.
      status: strVal(hookData.status), // Extract the status from hookData, ensuring it's a string.
      created: new Date(strVal(hookData.created)).getTime(), // Convert the created date to a timestamp.
      error: strValOrUndef(hookData.error), // Extract the error field, converting it to a string or undefined.
    });

    // Log the newly created hook object for debugging purposes.
    appLog.debug("MONGO HOOK", hook);
  } catch (error) {
    // If an error occurs during the hook creation, log the error.
    appLog.error("Error creating hook:", error);
  }
};
