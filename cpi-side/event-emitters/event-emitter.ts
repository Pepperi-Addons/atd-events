import { DataObject, FlowObject, Interceptor } from "@pepperi-addons/cpi-node";
import { EventsNames, atdFlowsConfigurationSchemaName } from "shared";
import { InterceptorData } from "../metadata";
import { IContext } from "@pepperi-addons/cpi-node/build/cpi-side/events";

export abstract class IEventEmitter {
    constructor(protected params: InterceptorData) { }

    async handleEvent() {
        const eventData = await this.getEventData(this.params.Data.DataObject);
        const eventKey = this.getEventKey();
        const draftKey = this.params.Data.DataObject.typeDefinition.uuid;
        // check if there's a draft associated with the ATDUUID
        const eventFromDraft = await this.getEventFromDraftIfExists(draftKey, eventKey, eventData.FieldID);
        if (!eventFromDraft) {
            // if there's no draft or the event is not defined in the draft, this is an old event and needs to be emitted
            return await this.emitEvent(eventKey, eventData);
        }
        else {
            // if there's a draft and the event is defined in the draft, run the flow
            const flowObject = eventFromDraft.Flow;
            const context = this.params.Data;
            return await this.runFlow(flowObject, eventData, context);
        }
            
    }

    private async emitEvent(eventKey: EventsNames, eventData: any) {
        return await pepperi.events.emit(eventKey, eventData, this.params.Data);
    }

    private async runFlow(flowOBject: FlowObject, eventData: any, context?: IContext) {
        return await pepperi.flows.run({
            RunFlow: flowOBject,
            Data: eventData,
            context: context
        })
    }

    private async getDraft(ATDUUID: string) {
        try {
            return await pepperi.addons.configurations.get(ATDUUID);
        }
        catch (ex) {
            if ((ex as Error).message.includes('Could not find object with key')) {
                return undefined;
            }
            console.error(`Error getting draft for ATDUUID: ${ATDUUID}`);
            throw ex;
        }
    }

    private async getEventFromDraftIfExists(ATDUUID: string, eventKey: EventsNames, fieldID?: string) {
        try {
            const draft = await this.getDraft(ATDUUID);
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
        catch (ex) {
            console.error(`Error getting event from draft for ATDUUID: ${ATDUUID}`);
            throw ex;
        }
    }

    protected abstract getEventData(dataObj: DataObject): Promise<any>;

    protected abstract getEventKey(): EventsNames;
}