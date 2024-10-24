import { Relation } from "@pepperi-addons/papi-sdk";
import config from "../addon.config.json";
import { UserEvent } from "./entities";

const filename = `file_${config.AddonUUID}`;

export type ObjectType = 'transactions' | 'transaction_lines' | 'activities'

export const WF_EVENT_PREFIX = 'WFAction';
export const TSA_EVENT_PREFIX = 'TSAEmitEvent';

export const AtdRelations: Relation[] = [{
    //meta data for relation of type NgComponent
    RelationName: "TransactionTypeListTabs",
    AddonUUID: config.AddonUUID,
    Name: "EventsRelations",
    Description: "Events (Deprecated)",
    SubType: "NG14",
    ModuleName: "ActivityEventsModule",
    ComponentName: "ActivityEventsComponent",
    Type: "NgComponent",
    AddonRelativeURL: filename,
    ElementsModule: 'WebComponents',
    ElementName: `atd-events-element-${config.AddonUUID}`,
    _Deprecated: true
},
{   //meta data for relation of type NgComponent
    RelationName: "ActivityTypeListTabs",
    AddonUUID: config.AddonUUID,
    Name: "EventsRelations",
    Description: "Events (Deprecated)",
    SubType: "NG14",
    ModuleName: "ActivityEventsModule",
    ComponentName: "ActivityEventsComponent",
    Type: "NgComponent",
    AddonRelativeURL: filename,
    ElementsModule: 'WebComponents',
    ElementName: `atd-events-element-${config.AddonUUID}`,
    _Deprecated: true
},
{
    //meta data for relation of type NgComponent
    RelationName: "TransactionTypeListTabs",
    AddonUUID: config.AddonUUID,
    Name: "EventsFlowsRelations",
    Description: "Events",
    SubType: "NG14",
    ModuleName: "ActivityFlowsModule",
    ComponentName: "ActivityFlowsComponent",
    Type: "NgComponent",
    AddonRelativeURL: filename,
    ElementsModule: 'WebComponents',
    ElementName: `atd-flows-element-${config.AddonUUID}`
},
{   //meta data for relation of type NgComponent
    RelationName: "ActivityTypeListTabs",
    AddonUUID: config.AddonUUID,
    Name: "EventsFlowsRelations",
    Description: "Events",
    SubType: "NG14",
    ModuleName: "ActivityFlowsModule",
    ComponentName: "ActivityFlowsComponent",
    Type: "NgComponent",
    AddonRelativeURL: filename,
    ElementsModule: 'WebComponents',
    ElementName: `atd-flows-element-${config.AddonUUID}`
},
{   // ATD Export relation
    RelationName: "ATDExport",
    AddonUUID: config.AddonUUID,
    Name: "ATDExportRelation",
    Description: "Used for exporting ATD flows draft object",
    Type: "AddonAPI",
    AddonRelativeURL: `/api/atd_export`,
},
{   // ATD Import relation
    RelationName: "ATDImport",
    AddonUUID: config.AddonUUID,
    Name: "ATDImportRelation",
    Description: "Used for importing ATD flows draft object",
    Type: "AddonAPI",
    AddonRelativeURL: `/api/atd_import`,
},
]

export const TransactionScopeLoadedEvent: UserEvent = {
    EventKey: 'OnTransactionLoaded',
    Title: 'Transaction Loaded',
    EventData: {
        TransactionUUID: {
            Type: 'String',
        }
    },
    EventFilter: {}
}
export const OnTransactionFieldChangedEvent: UserEvent = {
    EventKey: 'OnTransactionFieldChanged',
    Title: 'Transaction Field Changed',
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
    Title: 'Transaction Line Field Changed',
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