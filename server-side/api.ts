
import { Client, Request } from '@pepperi-addons/debug-server'
import { EventsService } from './services/events-service'


export async function get_transactions_events(client: Client, request: Request) {
    
    switch (request.method) {
        case 'GET': {
            const typeUuid = request.query.type_uuid;
            const service: EventsService = new EventsService(client, typeUuid);
            return await service.getWFEvents();
            break;
        }
        default: {
            throw new Error(`${request.method} not supported`);
        }
    }
}