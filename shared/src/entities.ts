import {  ConfigurationScheme } from "@pepperi-addons/papi-sdk";
import { AddonUUID } from '../../addon.config.json';



export const atdFlowsConfigurationSchemaName = 'ATDFlowsConfigurations';
export const eventConfigurationFields = {
    Events: {
        Type: "Array",
        /* SubType: ATDEvent // this is not supported in the SDK, but it should at least be documented
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