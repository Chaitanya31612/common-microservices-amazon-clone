import { Kafka } from 'kafkajs';

// Singleton class to manage Kafka client
export class KafkaWrapper {
  private static instance: KafkaWrapper;
  private _client?: Kafka;

  private constructor() {}

  public static getInstance(): KafkaWrapper {
    if (!KafkaWrapper.instance) {
      KafkaWrapper.instance = new KafkaWrapper();
    }
    return KafkaWrapper.instance;
  }

  get client() {
    if (!this._client) {
      throw new Error('Cannot access Kafka client before connecting');
    }
    return this._client;
  }

  connect(clientId: string, brokers: string[]) {
    this._client = new Kafka({
      clientId,
      brokers,
    });

    console.log('Kafka client created');
    return this._client;
  }
}

// Export a singleton instance
export const kafka = KafkaWrapper.getInstance();
