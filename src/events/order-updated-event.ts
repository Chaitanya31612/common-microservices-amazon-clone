import { Subjects } from "./subjects";
import { OrderStatus } from "./types/order-status";

export interface OrderUpdatedEvent {
  subject: Subjects.OrderUpdated;
  data: {
    id: string;
    version: number;
    status: OrderStatus;
    userId: string;
    // Optional fields that might be updated
    expiresAt?: string;
  };
}
