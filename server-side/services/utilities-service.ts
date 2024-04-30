import { PapiClient, InstalledAddon, ConfigurationScheme } from '@pepperi-addons/papi-sdk'
import { Client } from '@pepperi-addons/debug-server';

export class UtilitiesService {

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

    async createRelations(relations) {
        await Promise.all(relations.map(async (singleRelation) => {
            return await this.papiClient.addons.data.relations.upsert(singleRelation);
        }));
    }
      
    async getRelations(whereClause: string) {
        return await this.papiClient.addons.data.relations.find({where: whereClause})
    }

    async getAtd(uuid: string) {
        return  await this.papiClient.types.find({
            where: `UUID='${uuid}'`
        }).then((types) => {
            return types[0]
        });
    }

    getEventFilter(atdName: string) {
        return {
            ObjectType: atdName
        }
    }

    async createConfigurationSchema(configurationScheme: ConfigurationScheme) {
        return await this.papiClient.addons.configurations.schemes.upsert(configurationScheme)
    }
}
