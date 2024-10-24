import { Client } from "@pepperi-addons/debug-server/dist";
import { AddonDataScheme, ApiFieldObject } from "@pepperi-addons/papi-sdk";
import { UserEvent } from "../entities";
import { ObjectType, OnTransactionFieldChangedEvent, OnTransactionLineFieldChangedEvent, TransactionScopeLoadedEvent, TSA_EVENT_PREFIX, WF_EVENT_PREFIX } from "../metadata";
import { RelationsService } from "./relations-service";
import { TransactionsService } from "./transactions-service";
import { UtilitiesService } from "./utilities-service";


export class EventsService {
    utilities = new UtilitiesService(this.client);
    transactionsService = new TransactionsService(this.client, this.atdUUID);
    relationsService = new RelationsService(this.client);

    atdName: string = '';

    constructor(private client: Client, private atdUUID: string) { }

    async getTransactionEvents(): Promise<UserEvent[]> {
        const res: UserEvent[] = []
        this.atdName = await this.transactionsService.getName(this.atdUUID);
        const atdType: number = await this.transactionsService.getType(this.atdUUID);
        const wfEvents = await this.getWFEvents();
        res.push(...wfEvents);
        // only if the type is transaction, add the transaction events to the result
        if(atdType === 2) {
            const internalEvents = await this.getInternalTransactionEvents();
            const relationsEvents = await this.relationsService.getTransactionsEvents(this.atdName);
            res.push(...internalEvents);
            res.push(...relationsEvents);
        }
        return res;
    }

    async getWFEvents(): Promise<UserEvent[]> {

        const fields = await this.transactionsService.getWFEventFields();
        const events = this.convertFieldsToWFEvents(fields);

        return events;
    }

    private convertFieldsToWFEvents(fields: ApiFieldObject[]): UserEvent[] {
        const eventNames = this.getEventNamesFromFields(fields);
        const events: UserEvent[] = eventNames.map(eventName => this.getWFUserEvent(eventName));
        return events;
    }
    
    private getEventNamesFromFields(fields: ApiFieldObject[]): string[] {
        const res: string[] = fields.map(field => {
            const eventName = field.FieldID.replace(TSA_EVENT_PREFIX, '');
            return eventName;
        })
        return res;
    }

    private getWFEventData(): AddonDataScheme['Fields'] {
        return {
            ObjectKey: {
                Type: 'String'
            },
            ObjectType: {
                Type: 'String'
            }
        }
    }

    private getWFUserEvent(eventName): UserEvent {
        const eventKey = `${WF_EVENT_PREFIX}${eventName}`;
        const filter = this.utilities.getEventFilter(this.atdName);
        const eventData = this.getWFEventData();
        return {
            EventKey: eventKey,
            EventFilter: filter,
            EventData: eventData,
            Title: eventName
        }
    }

    private async getInternalTransactionEvents(): Promise<UserEvent[]> {
        const res: UserEvent[] = [];
        res.push(this.getTransactionLoadedEvent())
        res.push(await this.getFieldChangeEvent('transactions'))
        res.push(await this.getFieldChangeEvent('transaction_lines'))
        return res;
    }

    private getTransactionLoadedEvent(): UserEvent {
        return {
            ...TransactionScopeLoadedEvent,
            EventFilter: this.utilities.getEventFilter(this.atdName)
        }
    }

    private async getFieldChangeEvent(type: ObjectType): Promise<UserEvent> {
        const fields = await this.transactionsService.getFields(type);
        const filter = this.utilities.getEventFilter(this.atdName);
        const event = type === 'transactions' ? OnTransactionFieldChangedEvent : OnTransactionLineFieldChangedEvent;
        return {
            ...event,
            EventFilter: filter,
            Fields: fields.map(field => {
                return {
                    ApiName: field.FieldID,
                    Title: field.Label
                }
            }).sort((a,b) => a.Title.localeCompare(b.Title))
        }
    }    
}