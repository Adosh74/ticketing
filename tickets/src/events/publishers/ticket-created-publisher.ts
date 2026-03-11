import { Publisher, TicketCreatedEvent, Subjects } from "@mshebltickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated
    
}