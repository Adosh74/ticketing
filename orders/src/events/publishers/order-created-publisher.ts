import { OrderCreatedEvent, Subjects, Publisher } from '@mshebltickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
