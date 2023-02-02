
import '@pepperi-addons/cpi-node'
import { DataObject } from '@pepperi-addons/cpi-node';
import { InterceptorData } from "../metadata";
import { IEventEmitter } from "./event-emitter";
import { TransactionFieldChangeEventEmitter } from "./transaction-field-change-emitter";
import { TransactionLineFieldChangeEventEmitter } from "./transaction-line-field-change-emitter";
import { TransactionScopeLoadEventEmitter } from "./transaction-scope-load-emitter";

export class EventEmitterFactory {
    static create(eventKey: string, params: InterceptorData): IEventEmitter {
        let res: IEventEmitter;
        const dataObject = params.Data.DataObject as DataObject;
        switch (eventKey) {
            case 'PreLoadTransactionScope': {
                res = new TransactionScopeLoadEventEmitter(params);
                break;
            }
            case 'OnLoadTransactionScope': {
                res = new TransactionScopeLoadEventEmitter(params);
                break;
            }
            case 'SetFieldValue': 
            case 'IncrementFieldValue': 
            case 'DecrementFieldValue': {
                if (dataObject.resource === 'transactions') {
                    res = new TransactionFieldChangeEventEmitter(params);
                }
                else {
                    res = new TransactionLineFieldChangeEventEmitter(params);
                }
                break;
            }
            default: {
                throw new Error(`event ${eventKey} is not supported`);
            }
        }

        return res;
    }
}