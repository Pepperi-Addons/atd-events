import { DataObject, TransactionLine } from "@pepperi-addons/cpi-node";
import { EventsNames } from "shared";
import { InterceptorData } from "../metadata";
import { IEventEmitter } from "./event-emitter";

export class TransactionLineFieldChangeEventEmitter extends IEventEmitter {
    
    constructor(params: InterceptorData) {
        super(params);
    }

    protected async getEventData(dataObj: TransactionLine) {
        const oldValue = await dataObj.getFieldValue(this.params.Data.FieldID);
        await this.params.NextFunction(this.params.MainFunction);
        const newValue = await dataObj.getFieldValue(this.params.Data.FieldID);

        return {
            TransactionUUID: dataObj.transaction.uuid,
            TransactionLineUUID: dataObj.uuid,
            FieldID: this.params.Data.FieldID,
            OldValue: oldValue,
            NewValue: newValue,
            ObjectType: dataObj.typeDefinition?.uuid || ''
        }
    }

    protected getEventKey(): EventsNames {
        return 'OnTransactionLineFieldChanged'
    }
}