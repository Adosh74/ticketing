import { Model, Schema, model, Document } from 'mongoose';
import { OrderStatus } from '@mshebltickets/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order } from './order';

interface TicketAttrs {
	id: string;
	title: string;
	price: number;
}

export interface TicketDoc extends Document {
	title: string;
	price: number;
	version: number;
	isReserved(): Promise<Boolean>;
}

interface TicketModel extends Model<TicketDoc> {
	build(attrs: TicketAttrs): TicketDoc;
	findByEvent(event: { id: string; version: number }): Promise<TicketDoc | null>;
}

const ticketSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
			},
		},
	}
);

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.findByEvent = async (event: { id: string; version: number }) => {
	return Ticket.findOne({
		_id: event.id,
		version: event.version - 1,
	});
};

ticketSchema.statics.build = (attrs: TicketAttrs): TicketDoc => {
	return new Ticket({
		_id: attrs.id,
		title: attrs.title,
		price: attrs.price,
	});
};

ticketSchema.methods.isReserved = async function (): Promise<Boolean> {
	const existingOrder = await Order.findOne({
		ticket: this,
		status: {
			$in: [OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete],
		},
	});
	return !!existingOrder;
};

const Ticket = model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
