import { DataObject } from "@pepperi-addons/cpi-node";
import { EventsNames } from "shared";
import { InterceptorData } from "../metadata";
import { IEventEmitter } from "./event-emitter";

export class TransactionScopeEventEmitter extends IEventEmitter {

    constructor(params: InterceptorData) {
        super(params);
    }

    protected async getEventData(dataObj: DataObject) {
        await this.params.NextFunction(this.params.MainFunction);
        return {
            TransactionUUID: dataObj.uuid,
            DataObject: this.params.Data.DataObject,
        }
    }

    protected getEventKey(): EventsNames {
        throw new Error('method not implemented');
    }
}