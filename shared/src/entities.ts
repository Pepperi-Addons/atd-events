import {  ConfigurationScheme } from "@pepperi-addons/papi-sdk";
import { AddonUUID } from '../../addon.config.json';



export const atdFlowsConfigurationSchemaName = 'ATDFlowsConfigurations';

export const eventConfigurationFields = {
    ATDUUID: {
        Type: "String",
    },
    Events: {
        Type: "Array",
        /* SubType: { // this is not supported in the SDK, but it should at least be documented
            Title: {
                Type: "String",
            },
            EventKey: {
                Type: "String",
            },
            EventField: {
                Type: "String",
            },
            EventFilter: {
                Type: "Object",
            },
            Flow: {
                Type: "String",
            },
        }
        */
    },
} as any;

export const atdFlowsConfigurationSchema: ConfigurationScheme = {
    Name: atdFlowsConfigurationSchemaName,
    AddonUUID: AddonUUID,
    Fields: eventConfigurationFields,
    SyncData:
    {
        Sync: true,
    }
};