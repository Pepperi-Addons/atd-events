import '@pepperi-addons/cpi-node'
import { MainFunction } from '@pepperi-addons/cpi-node';
import { EventKey, IContextWithData } from '@pepperi-addons/cpi-node/build/cpi-side/events';
import {EventsNames} from 'shared'
import { EventEmitterFactory } from '../event-emitters/event-emitter-factory';

export class EventsService {
    constructor() {}

    handleEvent(eventKey: EventKey, interceptorData: InterceptorData) {
        const emitter = EventEmitterFactory.create(eventKey, interceptorData);
        emitter.handleEvent();
    }
}

export interface InterceptorData {
    Data: IContextWithData;
    NextFunction: (main: MainFunction) => Promise<void>;
    MainFunction: MainFunction;
}