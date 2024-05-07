import { Relation } from "@pepperi-addons/papi-sdk";
import config from "../addon.config.json";
import { UserEvent } from "./entities";

const filename = `file_${config.AddonUUID}`;

export type ObjectType = 'transactions' | 'transaction_lines' | 'activities'

export const WF_EVENT_PREFIX = 'WFAction';
export const TSA_EVENT_PREFIX = 'TSAEmitEvent';

export const AtdRelations: Relation[] = [{
    //meta data for realtion of type NgComponent
    RelationName: "TransactionTypeListTabs",
    AddonUUID: config.AddonUUID,
    Name: "EventsRelations",
    Description: "events",
    SubType: "NG14",
    ModuleName: "ActivityEventsModule",
    ComponentName: "ActivityEventsComponent",
    Type: "NgComponent",
    AddonRelativeURL: filename,
    ElementsModule: 'WebComponents',
    ElementName: `atd-events-element-${config.AddonUUID}`
},
{   //meta data for realtion of type NgComponent
    RelationName: "ActivityTypeListTabs",
    AddonUUID: config.AddonUUID,
    Name: "EventsRelations",
    Description: "events",
    SubType: "NG14",
    ModuleName: "ActivityEventsModule",
    ComponentName: "ActivityEventsComponent",
    Type: "NgComponent",
    AddonRelativeURL: filename,
    ElementsModule: 'WebComponents',
    ElementName: `atd-events-element-${config.AddonUUID}`
},
{
    //meta data for realtion of type NgComponent
    RelationName: "TransactionTypeListTabs",
    AddonUUID: config.AddonUUID,
    Name: "EventsFlowsRelations",
    Description: "events",
    SubType: "NG14",
    ModuleName: "ActivityFlowsModule",
    ComponentName: "ActivityFlowsComponent",
    Type: "NgComponent",
    AddonRelativeURL: filename,
    ElementsModule: 'WebComponents',
    ElementName: `atd-flows-element-${config.AddonUUID}`
},
{   //meta data for realtion of type NgComponent
    RelationName: "ActivityTypeListTabs",
    AddonUUID: config.AddonUUID,
    Name: "EventsFlowsRelations",
    Description: "events",
    SubType: "NG14",
    ModuleName: "ActivityFlowsModule",
    ComponentName: "ActivityFlowsComponent",
    Type: "NgComponent",
    AddonRelativeURL: filename,
    ElementsModule: 'WebComponents',
    ElementName: `atd-flows-element-${config.AddonUUID}`
}]

export const TransactionScopeLoadEvent: UserEvent = {
    EventKey: 'OnTransactionLoad',
    Title: 'transaction loading',
    EventData: {
        TransactionUUID: {
            Type: 'String',
        }
    },
    EventFilter: {}
}

export const TransactionScopeLoadedEvent: UserEvent = {
    EventKey: 'OnTransactionLoaded',
    Title: 'transaction loaded',
    EventData: {
        TransactionUUID: {
            Type: 'String',
        }
    },
    EventFilter: {}
}
export const OnTransactionFieldChangedEvent: UserEvent = {
    EventKey: 'OnTransactionFieldChanged',
    Title: 'transaction field changed',
    EventData: {
        TransactionUUID: {
            Type: 'String',
        },
        FieldID: {
            Type: 'String',
        },
        NewValue: {
            Type: 'String',
        },
        OldValue: {
            Type: 'String',
        },
    },
    EventFilter: {}
}

export const OnTransactionLineFieldChangedEvent: UserEvent = {
    EventKey: 'OnTransactionLineFieldChanged',
    Title: 'transaction line field changed',
    EventData: {
        TransactionUUID: {
            Type: 'String',
        },
        TransactionLineUUID: {
            Type: 'String',
        },
        FieldID: {
            Type: 'String',
        },
        NewValue: {
            Type: 'String',
        },
        OldValue: {
            Type: 'String',
        },
    },
    EventFilter: {}
}