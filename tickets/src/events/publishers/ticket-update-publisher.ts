import { Publisher, TicketUpdatedEvent, Subjects } from '@mshebltickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	subject: Subjects.TickerUpdated = Subjects.TickerUpdated;
}
