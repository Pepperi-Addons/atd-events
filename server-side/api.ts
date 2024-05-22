
import { Client, Request } from '@pepperi-addons/debug-server'
import { EventsService } from './services/events-service'
import { ConfigurationsService } from './services/configurations-service';
import { Draft } from '@pepperi-addons/papi-sdk';
import { TransactionsService } from './services/transactions-service';


export async function get_transactions_events(client: Client, request: Request) {
    
    switch (request.method) {
        case 'GET': {
            const typeUuid = request.query.type_uuid;
            const service: EventsService = new EventsService(client, typeUuid);
            return await service.getTransactionEvents();
        }
        default: {
            throw new Error(`${request.method} not supported`);
        }
    }
}

export async function draft(client: Client, request: Request) {
    switch (request.method) {
        case 'POST': {
            const configurationsService: ConfigurationsService = new ConfigurationsService(client);
            const draft = request.body as Draft;
            return await configurationsService.upsertAndPublishDraft(draft);
        }
        case 'GET': {
            const configurationsService: ConfigurationsService = new ConfigurationsService(client);
            const draftKey = request.query.draft_key;
            if (!draftKey) {
                throw new Error('draft_key is a required query parameter for this endpoint.');
            }
            return await configurationsService.getDraft(draftKey);
        }
        default: {
            throw new Error(`${request.method} not supported`);
        }
    }
}

export async function get_events(client: Client, request: Request) {
    switch (request.method) {
        case 'GET': {
            const configurationsService: ConfigurationsService = new ConfigurationsService(client);
            const draftKey = request.query.draft_key;
            if (!draftKey) {
                throw new Error('draft_key is a required query parameter for this endpoint.');
            }
            return await configurationsService.getATDEvents(draftKey);
        }
        default: {
            throw new Error(`${request.method} not supported`);
        }
    }
}

export async function atd_export(client: Client, request: Request) {
    switch (request.method) {
        case 'GET': {
            const internalID = request.query.internal_id;
            const transactionService: TransactionsService = new TransactionsService(client, ''); // we don't have the ATD UUID yet and it is not required for this operation
            const atdUUID = await transactionService.getUUID(parseInt(internalID));
            const configurationsService: ConfigurationsService = new ConfigurationsService(client);
            const draft = await configurationsService.getDraft(atdUUID);
            return { DataForImport: { atdFlowsDraftObject: draft } };
        }
        default: {
            throw new Error(`${request.method} not supported`);
        }
    }
}

export async function atd_import(client: Client, request: Request) {
    switch (request.method) {
        case 'POST': {
            const internalID = request.body.InternalID;
            const dataFromExport = request.body.DataFromExport;
            const transactionService: TransactionsService = new TransactionsService(client, ''); // we don't have the ATD UUID yet and it is not required for this operation
            const atdUUID = await transactionService.getUUID(parseInt(internalID));
            const configurationsService: ConfigurationsService = new ConfigurationsService(client);
            const draft = dataFromExport.atdFlowsDraftObject;
            // need to change the draft key to the ATD UUID
            draft.Key = atdUUID;
            return await configurationsService.upsertAndPublishDraft(draft);
        }
        default: {
            throw new Error(`${request.method} not supported`);
        }
    }
}