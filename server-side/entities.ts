import { AddonDataScheme } from "@pepperi-addons/papi-sdk";

export interface EventsRelation {
    Events: UserEvent[];
}
export interface UserEvent {
    Title: string;
    EventKey: string;
    EventFilter: {
        [key: string]: any;
    };
    Fields?: {
        ApiName: string;
        Title: string;
    }[];
    EventData: AddonDataScheme['Fields'];
}