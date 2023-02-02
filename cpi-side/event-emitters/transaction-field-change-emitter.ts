import { DataObject } from "@pepperi-addons/cpi-node";
import { EventsNames } from "shared";
import { InterceptorData } from "../metadata";
import { IEventEmitter } from "./event-emitter";

export class TransactionFieldChangeEventEmitter extends IEventEmitter {
    
    constructor(params: InterceptorData) {
        super(params);
    }

    protected async getEventData(dataObj: DataObject) {
        
        const oldValue = dataObj.getFieldValue(this.params.Data.FieldID);
        await this.params.NextFunction(this.params.MainFunction);
        const newValue = await dataObj.getFieldValue(this.params.Data.FieldID);

        return {
            TransactionUUID: dataObj.uuid,
            FieldID: this.params.Data.FieldID,
            OldValue: oldValue,
            NewValue: newValue,
        }
    }

    protected getEventKey(): EventsNames {
        return 'OnTransactionFieldChanged';
    }
}