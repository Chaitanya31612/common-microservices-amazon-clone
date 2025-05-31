import { Consumer, EachMessagePayload, Kafka } from "kafkajs";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"], msg: EachMessagePayload): void;

  protected consumer!: Consumer;
  private kafka: Kafka;

  constructor(client: Kafka) {
    this.kafka = client;
    // Will initialize consumer in the listen method to avoid accessing abstract property
  }

  async listen() {
    // Initialize consumer here to avoid accessing abstract property in constructor
    this.consumer = this.kafka.consumer({ groupId: this.queueGroupName });
    await this.consumer.connect();
    await this.consumer.subscribe({ 
      topic: this.subject,
      fromBeginning: true 
    });

    await this.consumer.run({
      eachMessage: async (messagePayload: EachMessagePayload) => {
        console.log(
          `Message received from ${this.subject} / ${this.queueGroupName}`
        );

        const parsedData = this.parseMessage(messagePayload);
        await this.onMessage(parsedData, messagePayload);
      },
    });

    // Add a shutdown hook
    const errorTypes = ['unhandledRejection', 'uncaughtException'];
    const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
    
    errorTypes.forEach(type => {
      process.on(type, async () => {
        try {
          console.log(`Process ${type}, closing consumer...`);
          await this.consumer.disconnect();
          process.exit(0);
        } catch (e) {
          console.error(`Error on process ${type}:`, e);
          process.exit(1);
        }
      });
    });

    signalTraps.forEach(type => {
      process.once(type, async () => {
        try {
          await this.consumer.disconnect();
        } finally {
          process.kill(process.pid, type);
        }
      });
    });
  }

  parseMessage(messagePayload: EachMessagePayload) {
    const { message } = messagePayload;
    const value = message.value;
    const messageString = value ? value.toString() : '';

    try {
      return JSON.parse(messageString); // Try to parse JSON
    } catch (err) {
      console.warn("Non-JSON message received:", messageString);
      return messageString; // Return the raw string if parsing fails
    }
  }
}
