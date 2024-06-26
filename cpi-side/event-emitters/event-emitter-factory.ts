
import '@pepperi-addons/cpi-node'
import { DataObject } from '@pepperi-addons/cpi-node';
import { InterceptorData } from "../metadata";
import { IEventEmitter } from "./event-emitter";
import { TransactionFieldChangeEventEmitter } from "./transaction-field-change-emitter";
import { TransactionLineFieldChangeEventEmitter } from "./transaction-line-field-change-emitter";
import { TransactionScopeLoadEventEmitter } from "./transaction-scope-load-emitter";
import { TransactionScopeLoadedEventEmitter } from './transaction-scope-loaded-emitter';
import { TransactionWorkFlowActionEmitter } from './transaction-work-flow-action-emitter';

export class EventEmitterFactory {
    static create(eventKey: string, params: InterceptorData): IEventEmitter | undefined {
        let res: IEventEmitter | undefined = undefined;
        const dataObject = params.Data.DataObject as DataObject;
        switch (eventKey) {
            case 'PreLoadTransactionScope': {
                res = new TransactionScopeLoadEventEmitter(params);
                break;
            }
            case 'OnLoadTransactionScope': {
                res = new TransactionScopeLoadedEventEmitter(params);
                break;
            }
            case 'SetFieldValue':
            case 'IncrementFieldValue':
            case 'DecrementFieldValue': {
                if (dataObject.resource === 'transactions') {
                    res = new TransactionFieldChangeEventEmitter(params);
                }
                else if (dataObject.resource === 'transaction_lines') {
                    res = new TransactionLineFieldChangeEventEmitter(params);
                }
                break;
            }
            default: {
                if (eventKey.startsWith('WFAction')) {
                    res = new TransactionWorkFlowActionEmitter(params, eventKey);
                }
                else {
                    throw new Error(`event ${eventKey} is not supported`);
                }
            }
        }

        return res;
    }
}