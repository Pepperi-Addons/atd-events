import { Client } from "@pepperi-addons/debug-server/dist";
import { AddonDataScheme, ApiFieldObject } from "@pepperi-addons/papi-sdk";
import { UserEvent } from "../entities";
import { TSA_EVENT_PREFIX, WF_EVENT_PREFIX } from "../metadata";
import { TransactionsService } from "./transactions-service";
import { UtilitiesService } from "./utilities-service";


export class EventsService {
    utilities = new UtilitiesService(this.client);
    transactionsService = new TransactionsService(this.client);

    constructor(private client: Client, private atdUUID: string) { }

    async getWFEvents(): Promise<UserEvent[]> {

        const fields = await this.transactionsService.getWFEventFields(this.atdUUID);
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

    private getEventFilter() {
        return {
            DataObject: {
                typeDefinition: {
                    uuid: this.atdUUID
                }
            }
        }
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
        const filter = this.getEventFilter();
        const eventData = this.getWFEventData();
        return {
            EventKey: eventKey,
            EventFilter: filter,
            EventData: eventData,
            Title: eventName
        }
    }
    
}