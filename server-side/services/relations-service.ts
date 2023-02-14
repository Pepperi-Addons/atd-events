import { Client } from "@pepperi-addons/debug-server/dist";
import { Relation } from "@pepperi-addons/papi-sdk";
import { EventsRelation, UserEvent } from "../entities";
import { UtilitiesService } from './utilities-service';

export class RelationsService {
    utilities: UtilitiesService = new UtilitiesService(this.client);
    constructor(private client: Client) { }

    async getTransactionsEvents(atdName: string): Promise<UserEvent[]> {
        // get relations of type UDCEvents with collection name
        const relations = await this.getRelations('transactions');
        // call the relation api function to get the events
        const events = (await this.getEventsFromRelations(relations, 'transactions')).Events;
        return this.addEventFilter(events, atdName);
    }
    
    addEventFilter(events: UserEvent[], atdName: string): UserEvent[] {
        return events.map((event) => {
            const filter = this.utilities.getEventFilter(atdName);
            event.EventFilter = {
                ...filter,
                ...event.EventFilter
            }
            return event;
        })
    }
    
    async getEventsFromRelations(relations: Relation[], atdName: string) {
        const res = await Promise.all(relations.map(async (relation): Promise<EventsRelation> => {
            if (relation.AddonRelativeURL) {
                return (await this.utilities.papiClient.get(`/addons/api/${relation.AddonUUID}/${relation.AddonRelativeURL}?collection_name=${atdName}`)) as EventsRelation;
            }
            else {
                throw new Error(`AddonRelativeURL is mandatory on relations of type UDCEvents. atdName: ${atdName}.`)
            }
        }));
        return res.reduce((prev, current)=> {
            prev.Events.push(...current.Events);
            return prev;
        }, { Events:[] });

    }
    
    async getRelations(atdName: string) {
        const whereClause = `RelationName=UDCEvents And Name='${atdName}'`;
        return await this.utilities.getRelations(whereClause);
    }
}