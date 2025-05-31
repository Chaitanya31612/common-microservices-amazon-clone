import { Kafka, Producer } from "kafkajs";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];
  private producer: Producer;

  constructor(client: Kafka) {
    this.producer = client.producer();
  }

  async connect(): Promise<void> {
    await this.producer.connect();
  }

  async publish(data: T["data"]): Promise<void> {
    try {
      // Ensure producer is connected
      if (!this.producer) {
        throw new Error('Cannot publish event, producer not connected');
      }

      await this.producer.send({
        topic: this.subject,
        messages: [
          { value: JSON.stringify(data) }
        ],
      });
      console.log("Event published to topic", this.subject);
    } catch (err) {
      console.error("Failed to publish event:", err);
      throw err; // Rethrow the error to propagate it to the caller
    }
  }

  async disconnect(): Promise<void> {
    await this.producer.disconnect();
  }
}
