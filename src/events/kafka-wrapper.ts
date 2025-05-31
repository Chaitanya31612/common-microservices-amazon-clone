import { Kafka } from 'kafkajs';

// Singleton class to manage Kafka client
export class KafkaWrapper {
  private _client?: Kafka;

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

export const kafka = new KafkaWrapper();
