export enum Subjects {
  // Remove unused ticket events
  
  OrderCreated = "order:created",
  OrderUpdated = "order:updated",
  OrderCancelled = "order:cancelled",

  PaymentCreated = "payment:created",
  PaymentSucceeded = "payment:succeeded",
  PaymentFailed = "payment:failed",
}
