import { DataObject, Interceptor } from "@pepperi-addons/cpi-node";
import { EventsNames } from "shared";
import { InterceptorData } from "../metadata";

export abstract class IEventEmitter {
    constructor(protected params: InterceptorData) { }

    async handleEvent() {
        const eventData = await this.getEventData(this.params.Data.DataObject);
        const eventKey = this.getEventKey();
        return await this.emitEvent(eventKey, eventData);
    }

    async emitEvent(eventKey: EventsNames, eventData: any) {
        return await pepperi.events.emit(eventKey, eventData, this.params.Data);
    }

    protected abstract getEventData(dataObj: DataObject): Promise<any>;

    protected abstract getEventKey(): EventsNames;
}