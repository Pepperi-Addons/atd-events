import { Client } from "@pepperi-addons/debug-server/dist";
import { Type } from "@pepperi-addons/papi-sdk";
import { TSA_EVENT_PREFIX, ObjectType} from "../metadata";
import { UtilitiesService } from "./utilities-service";

export class TransactionsService {

    utilities = new UtilitiesService(this.client);
    atd?: Type;
    
    constructor(private client: Client, private atdUUID) { }

    private async initATD(uuid: string) {
        const types = await this.utilities.papiClient.types.find({
            where: `UUID='${uuid}'`
        });
        if(types && types.length > 0) {
            this.atd = types[0];
        }
        else {
            console.error(`could not find atd with UUID: ${uuid}`)
        }
    }

    private async getInternalID(uuid: string): Promise<number> {
        if (!this.atd) {
            await this.initATD(uuid);
        }
        return this.atd?.InternalID || -1;
    }
    
    async getName(uuid: string): Promise<string> {
        if (!this.atd) {
            await this.initATD(uuid);
        }
        return this.atd?.Name || '';
    }

    async getFields(type: ObjectType) {
        const atdID = await this.getInternalID(this.atdUUID);
        return await this.utilities.papiClient.metaData.type(type).types.subtype(atdID.toString()).fields.get();
    }

    private async getBooleanFields(type: ObjectType) {
        const fields = await this.getFields(type);

        return fields.filter(field => {
            return field.Type === 'Boolean'
        })
    }

    async getWFEventFields() {
        const booleanFields = await this.getBooleanFields('transactions');
        const res = booleanFields.filter(field => field.FieldID.startsWith(TSA_EVENT_PREFIX));
        return res;
    }
}