export const PRE_LOAD_TRANSACTION_SCOPE_EVENT_KEY = 'OnTransactionLoad'
export const ON_LOAD_TRANSACTION_SCOPE_EVENT_KEY = 'OnTransactionLoaded'
export const TRANSACTION_FIELD_CHANGE_EVENT_KEY = 'OnTransactionFieldChanged'
export const TRANSACTION_LINE_FIELD_CHANGE_EVENT_KEY = 'OnTransactionLineFieldChanged'

const eventTypes = [
    PRE_LOAD_TRANSACTION_SCOPE_EVENT_KEY,
    ON_LOAD_TRANSACTION_SCOPE_EVENT_KEY,
    TRANSACTION_FIELD_CHANGE_EVENT_KEY,
    TRANSACTION_LINE_FIELD_CHANGE_EVENT_KEY
] as const

export type EventType = typeof eventTypes[number]

export interface FlowObject {
    FlowKey: string;
    FlowParams: {
        [key: string]: {
            Source: FlowParamSource,
            // the value type should match the parameter type.
            Value: any
        }
    }
}
 
export type FlowParamSource = 'Static' | 'Dynamic'

export type EventsNames = typeof eventTypes[number];

export interface ATDEventForDraft {
    EventKey: EventsNames,
    FieldID: string,
    Flow: FlowObject,
}

export interface ATDEventForUI extends ATDEventForDraft {
    FlowName: string,
}
