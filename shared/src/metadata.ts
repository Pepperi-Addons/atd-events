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

export type EventsNames = typeof eventTypes[number];