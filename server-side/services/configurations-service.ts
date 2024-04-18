import { PapiClient, Draft } from '@pepperi-addons/papi-sdk'
import { Client } from '@pepperi-addons/debug-server';
import { AddonUUID } from '../../addon.config.json';
import { atdFlowsConfigurationSchemaName, PostAndPublishDraftResponse } from 'shared';

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
            console.log(`upsertDraft ${JSON.stringify(draft)}`)
            return await this.papiClient.addons.configurations.addonUUID(AddonUUID).scheme(atdFlowsConfigurationSchemaName).drafts.upsert(draft);
        }
        catch (ex) {
            console.error(`Error in upsertDraft ${ex}`)
            throw ex;
        }
    }

    private async publishDraft(draftKey: string): Promise<{VersionKey: string}> {
        try {
            console.log(`publishDraft ${draftKey}`)
            return await this.papiClient.addons.configurations.addonUUID(AddonUUID).scheme(atdFlowsConfigurationSchemaName).drafts.key(draftKey).publish();
        }
        catch (ex) {
            console.error(`Error in publishDraft ${ex}`)
            throw ex;
        }
    }

    async upsertAndPublishDraft(draft: Draft): Promise<PostAndPublishDraftResponse> {
        try {
            if (!draft.Key) {
                throw new Error(`Draft key is missing for draft ${JSON.stringify(draft)}. The key should be the same as the ATD UUID.`);
            }
            const upsertedDraft = await this.upsertDraft(draft);
            if (!upsertedDraft.Key) {
                throw new Error(`Draft key is missing for upserted draft ${JSON.stringify(upsertedDraft)}.`); // this shouldn't really happen, but just in case
            }
            const VersionKey = await this.publishDraft(upsertedDraft.Key);
            return {PublishedDraft: upsertedDraft, VersionKey: VersionKey.VersionKey};

        }
        catch (ex) {
            console.error(`Error in upsertAndPublishDraft ${ex}`)
            throw ex;
        }
    }
}
