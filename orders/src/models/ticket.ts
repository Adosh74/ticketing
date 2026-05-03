import { Model, Schema, model, Document } from 'mongoose';
import { Order } from './order';
import { OrderStatus } from '@mshebltickets/common';

interface TicketAttrs {
	title: string;
	price: number;
}

export interface TicketDoc extends Document {
	title: string;
	price: number;
	isReserved(): Promise<Boolean>;
}

interface TicketModel extends Model<TicketDoc> {
	build(attrs: TicketAttrs): TicketDoc;
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

ticketSchema.statics.build = (attrs: TicketAttrs): TicketDoc => {
	return new Ticket(attrs);
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
