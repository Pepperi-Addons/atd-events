import '@pepperi-addons/cpi-node'
import { EventEmitterFactory } from '../event-emitters/event-emitter-factory';
import { InterceptorData } from '../metadata';

export class SubscriptionService {
    constructor() {}

    async registerEvents() {
        pepperi.events.intercept('PreLoadTransactionScope', {}, async (data, next, main) => { return await this.handleEvent(data, next, main, 'PreLoadTransactionScope') });
        pepperi.events.intercept('OnLoadTransactionScope', {}, async (data, next, main) => { return await this.handleEvent(data, next, main, 'OnLoadTransactionScope') });
        pepperi.events.intercept('IncrementFieldValue', {}, async (data, next, main) => { return await this.handleEvent(data, next, main, 'IncrementFieldValue') });
        pepperi.events.intercept('DecrementFieldValue', {}, async (data, next, main) => { return await this.handleEvent(data, next, main, 'DecrementFieldValue') });
        pepperi.events.intercept('SetFieldValue', {}, async (data, next, main) => { return await this.handleEvent(data, next, main, 'SetFieldValue') });
    }

    private async handleEvent(data, next, main, eventKey) {
        const interceptorData: InterceptorData = {
            Data: data,
            NextFunction: next,
            MainFunction: main
        }
        const emitter = EventEmitterFactory.create(eventKey, interceptorData);
        return await emitter.handleEvent();
    }
}