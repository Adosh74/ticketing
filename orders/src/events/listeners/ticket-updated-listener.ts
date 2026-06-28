import { Listener, Subjects, TicketUpdatedEvent } from '@mshebltickets/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
	subject: Subjects.TickerUpdated = Subjects.TickerUpdated;

	queueGroupName = queueGroupName;

	async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
		const { price, title } = data;

		const ticket = await Ticket.findByEvent(data);

		if (!ticket) {
			throw new Error('Ticket not found');
		}

		ticket.set({ price, title });

		await ticket.save();

		msg.ack();
	}
}
