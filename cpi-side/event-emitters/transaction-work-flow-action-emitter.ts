import { EventsNames } from "shared";
import { InterceptorData } from "../metadata";
import { IEventEmitter } from "./event-emitter";
import { DataObject } from "@pepperi-addons/cpi-node";

export class TransactionWorkFlowActionEmitter extends IEventEmitter {
    eventKey: string;
    constructor(params: InterceptorData, customEventKey: string) {
        super(params);
        this.eventKey = customEventKey;
    }

    protected async getEventData(dataObj: DataObject): Promise<any> {
        return {
            TransactionUUID: (dataObj as any).ObjectKey,
            ObjectType: (dataObj as any).ObjectType
        }
    }

    protected getEventKey(): EventsNames {
        return this.eventKey as EventsNames;
    }
}