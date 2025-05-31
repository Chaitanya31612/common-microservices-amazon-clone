import { Subjects } from "./subjects";
import { OrderStatus } from "./types/order-status";

export interface PaymentSucceededEvent {
  subject: Subjects.PaymentSucceeded;
  data: {
    id: string; // payment id
    orderId: string;
    stripeId: string;
  };
}
