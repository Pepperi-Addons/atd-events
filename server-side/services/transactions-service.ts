import { Client } from "@pepperi-addons/debug-server/dist";
import { TSA_EVENT_PREFIX, ObjectType} from "../metadata";
import { UtilitiesService } from "./utilities-service";

export class TransactionsService {

    utilities = new UtilitiesService(this.client);
    
    constructor(private client: Client) { }

    private async getInternalID(uuid: string): Promise<number> {
        let atdID = -1;
        const types = await this.utilities.papiClient.types.find({
            where: `UUID='${uuid}'`
        });

        if(types && types.length > 0) {
            atdID = types[0].InternalID;
        }
        else {
            console.error(`could not find atd with UUID: ${uuid}`)
        }
        return atdID;
    }

    private async getFields(type: ObjectType, atdID: number) {
        return await this.utilities.papiClient.metaData.type(type).types.subtype(atdID.toString()).fields.get();
    }

    private async getBooleanFields(type: ObjectType, atdID: number) {
        const fields = await this.getFields(type, atdID);

        return fields.filter(field => {
            return field.Type === 'Boolean'
        })
    }

    async getWFEventFields(atdUuid: string) {
        const atdID = await this.getInternalID(atdUuid);
        const booleanFields = await this.getBooleanFields('transactions', atdID);
        const res = booleanFields.filter(field => field.FieldID.startsWith(TSA_EVENT_PREFIX));
        return res;
    }
}