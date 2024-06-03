import '@pepperi-addons/cpi-node'
import { EventEmitterFactory } from '../event-emitters/event-emitter-factory';
import { InterceptorData } from '../metadata';
import { AddonUUID } from '../../addon.config.json'
import { atdFlowsConfigurationSchemaName } from 'shared';
import { DataObject } from '@pepperi-addons/cpi-node';

export class SubscriptionService {
    constructor() { }

    async registerEvents() {
        pepperi.events.intercept('PreLoadTransactionScope', {}, async (data, next, main) => { return await this.handleEvent(data, next, main, 'PreLoadTransactionScope') });
        pepperi.events.intercept('OnLoadTransactionScope', {}, async (data, next, main) => { return await this.handleEvent(data, next, main, 'OnLoadTransactionScope') });
        pepperi.events.intercept('IncrementFieldValue', {}, async (data, next, main) => { return await this.handleEvent(data, next, main, 'IncrementFieldValue') });
        pepperi.events.intercept('DecrementFieldValue', {}, async (data, next, main) => { return await this.handleEvent(data, next, main, 'DecrementFieldValue') });
        pepperi.events.intercept('SetFieldValue', {}, async (data, next, main) => { return await this.handleEvent(data, next, main, 'SetFieldValue') });

        // now we need to register to any workflow action events
        const drafts = await pepperi.addons.configurations.uuid(AddonUUID).schema(atdFlowsConfigurationSchemaName).get();
        if (drafts.length > 0) {
            drafts.forEach(draft => {
                const events = draft.Data.Events;
                if (events) {
                    events.forEach(event => {
                        if (event.EventKey.startsWith('WFAction')) {
                            pepperi.events.intercept(event.EventKey, {}, async (data, next, main) => {
                                // these events do not arrive with the DataObject required, so we need to fetch it
                                const obj = await pepperi.DataObject.Get("transactions", data.ObjectKey) ?? await pepperi.DataObject.Get("activities", data.ObjectKey);
                                data.DataObject = obj as DataObject;
                                return await this.handleEvent(data, next, main, event.EventKey)
                            });
                        }
                    });
                }
            });
        }
    }

    private async handleEvent(data, next, main, eventKey) {
        const interceptorData: InterceptorData = {
            Data: data,
            NextFunction: next,
            MainFunction: main
        }
        const emitter = EventEmitterFactory.create(eventKey, interceptorData);
        return emitter ? await emitter.handleEvent() : undefined;
    }
}