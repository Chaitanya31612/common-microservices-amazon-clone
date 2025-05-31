import { Subjects } from "./subjects";
import { OrderStatus } from "./types/order-status";

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    version: number;
    status: OrderStatus;
    userId: string;
    expiresAt: string;
    products: Array<{
      product: {
        id: number;
        title: string;
        price: number;
        description: string;
        category: string;
        image: string;
      };
      quantity: number;
    }>;
    // Calculate total price for payments service
    totalPrice: number;
  };
}
