import { PapiClient, Draft } from '@pepperi-addons/papi-sdk'
import { Client } from '@pepperi-addons/debug-server';
import { AddonUUID } from '../../addon.config.json';
import { ATDEvent, atdFlowsConfigurationSchemaName } from 'shared';

export class ConfigurationsService {

    papiClient: PapiClient

    constructor(private client: Client) {
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken,
            addonUUID: client.AddonUUID,
            addonSecretKey: client.AddonSecretKey,
            actionUUID: client.ActionUUID
        });
    }

    private async upsertDraft(draft: Draft): Promise<Draft> {
        try {
            console.log(`upsertDraft ${JSON.stringify(draft.Key)}`)
            return await this.papiClient.addons.configurations.addonUUID(AddonUUID).scheme(atdFlowsConfigurationSchemaName).drafts.upsert(draft);
        }
        catch (ex) {
            console.error(`Error in upsertDraft ${ex}`)
            throw ex;
        }
    }

    private async publishDraft(draftKey: string): Promise<{ VersionKey: string }> {
        try {
            console.log(`publishDraft ${draftKey}`)
            return await this.papiClient.addons.configurations.addonUUID(AddonUUID).scheme(atdFlowsConfigurationSchemaName).drafts.key(draftKey).publish();
        }
        catch (ex) {
            console.error(`Error in publishDraft ${ex}`)
            throw ex;
        }
    }

    async upsertAndPublishDraft(draft: Draft): Promise<Draft> {
        try {
            if (!draft.Key) {
                throw new Error(`Draft key is missing for draft ${JSON.stringify(draft)}. The key should be the same as the ATD UUID.`);
            }
            const upsertedDraft = await this.upsertDraft(draft);
            if (!upsertedDraft.Key) {
                throw new Error(`Draft key is missing for upserted draft ${JSON.stringify(upsertedDraft)}.`); // this shouldn't really happen, but just in case
            }
            await this.publishDraft(upsertedDraft.Key);
            return upsertedDraft;

        }
        catch (ex) {
            console.error(`Error in upsertAndPublishDraft ${ex}`)
            throw ex;
        }
    }

    async getATDEvents(atdUUID: string): Promise<ATDEvent[]> {
        try {
            const draft:Draft = await this.papiClient.addons.configurations.addonUUID(AddonUUID).scheme(atdFlowsConfigurationSchemaName).drafts.key(atdUUID).get();
            const atdEvents: ATDEvent[] = draft.Data.Events as ATDEvent[];
            return atdEvents;
        }
        catch (ex) {
            console.error(`Error in getATDEvents ${ex}`)
            throw ex;
        }
    }
}
