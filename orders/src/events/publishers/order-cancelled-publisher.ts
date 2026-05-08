import { OrderCancelledEvent, Publisher, Subjects } from '@mshebltickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
