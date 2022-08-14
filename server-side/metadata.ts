import { Relation } from "@pepperi-addons/papi-sdk";
import config from "../addon.config.json";

const filename = `file_${config.AddonUUID}`;

export const AtdRelations: Relation[] = [{   
    //meta data for realtion of type NgComponent
    RelationName: "TransactionTypeListTabs",
    AddonUUID: config.AddonUUID,
    Name:"EventsRelations",
    Description:"events",
    SubType: "NG14",
    ModuleName: "ActivityEventsModule",
    ComponentName: "ActivityEventsComponent",
    Type:"NgComponent",
    AddonRelativeURL:filename,
    ElementsModule: 'WebComponents',
    ElementName: `atd-events-element-${config.AddonUUID}`
},
{   //meta data for realtion of type NgComponent
    RelationName: "ActivityTypeListTabs",
    AddonUUID: config.AddonUUID,
    Name:"EventsRelations",
    Description:"events",
    SubType: "NG14",
    ModuleName: "ActivityEventsModule",
    ComponentName: "ActivityEventsComponent",
    Type:"NgComponent",
    AddonRelativeURL:filename,
    ElementsModule: 'WebComponents',
    ElementName: `atd-events-element-${config.AddonUUID}`
}]