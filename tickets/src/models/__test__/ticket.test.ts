import { Ticket } from '../ticket'
import { expect, it } from '@jest/globals';

it('implements optimistic concurrency control', async () => {
	const ticket = Ticket.build({
		title: 'concert',
		price: 2,
		userId: '1212',
	})

	await ticket.save();

	const firstInstance = await Ticket.findById(ticket.id)
	const secondInstance = await Ticket.findById(ticket.id)


	firstInstance!.set({ price: 10 });
	secondInstance!.set({ price: 15 });

	await firstInstance?.save();


	try {
		await secondInstance!.save();
	} catch (err) {
		return;
	}

	throw new Error('Should not reach this point');
});

it('Increments the version number on multiple saves', async () => {
	const ticket = Ticket.build({
		title: 'Ti',
		price: 12,
		userId: 'asdas',
	})

	await ticket.save();
	expect(ticket.version).toEqual(0);
	
	await ticket.save();
	expect(ticket.version).toEqual(1);

	await ticket.save();
	expect(ticket.version).toEqual(2);
})