import { DataObject, FlowObject, Interceptor } from "@pepperi-addons/cpi-node";
import { EventsNames, atdFlowsConfigurationSchemaName } from "shared";
import { InterceptorData } from "../metadata";

export abstract class IEventEmitter {
    constructor(protected params: InterceptorData) { }

    async handleEvent() {
        const eventData = await this.getEventData(this.params.Data.DataObject);
        const eventKey = this.getEventKey();
        // check if there's a draft associated with the TransactionUUID
        const eventFromDraft = await this.getEventFromDraftIfExists(eventData.TransactionUUID, eventKey, eventData.FieldID);
        if (!eventFromDraft) {
            // if there's no draft or the event is not defined in the draft, this is an old event and needs to be emitted
            return await this.emitEvent(eventKey, eventData);
        }
        else {
            // if there's a draft and the event is defined in the draft, run the flow
            const flowObject = eventFromDraft.FlowObject;
            return await this.runFlow(flowObject, eventData);
        }
            
    }

    private async emitEvent(eventKey: EventsNames, eventData: any) {
        return await pepperi.events.emit(eventKey, eventData, this.params.Data);
    }

    private async runFlow(flowOBject: FlowObject, eventData: any) {
        return await pepperi.flows.run({
            RunFlow: flowOBject,
            Data: eventData,
            context: undefined //TODO: this needs to be a thing?
        })
    }

    private async getDraft(transactionUUID: string) {
        try {
            // TODO: assuming this returns the draft with the given transactionUUID as a key, and otherwise returns undefined
            return await pepperi.addons.configurations.uuid(transactionUUID).schema(atdFlowsConfigurationSchemaName).get();
        }
        catch (ex) {
            if ((ex as Error).message.includes('Object ID does not exist')) {
                return undefined;
            }
            console.error(`Error getting draft for transactionUUID: ${transactionUUID}`);
            throw ex;
        }
    }

    private async getEventFromDraftIfExists(transactionUUID: string, eventKey: EventsNames, fieldID?: string) {
        try{
            const draft = await this.getDraft(transactionUUID);
            if (!draft) {
                return undefined;
            }
            const events = draft.Data.Events;
            if (!events) {
                return undefined;
            }
            const event = events.find((e: any) => e.EventKey === eventKey && (!fieldID || e.FieldID === fieldID));
            return event;
        }
        catch(ex){
            console.error(`Error getting event from draft for transactionUUID: ${transactionUUID}`);
            throw ex;
        }
    }

    protected abstract getEventData(dataObj: DataObject): Promise<any>;

    protected abstract getEventKey(): EventsNames;
}