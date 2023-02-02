import { Transaction } from "@pepperi-addons/cpi-node/build/cpi-side/app/entities";
import { EventKey } from "@pepperi-addons/cpi-node/build/cpi-side/events";
import { InterceptorData } from "../metadata";
import { IEventEmitter } from "./event-emitter";
import { TransactionFieldChangeEventEmitter } from "./transaction-field-change-emitter";
import { TransactionLineFieldChangeEventEmitter } from "./transaction-line-field-change-emitter";
import { TransactionScopeLoadEventEmitter } from "./transaction-scope-load-emitter";

export class EventEmitterFactory {
    static create(eventKey: EventKey, params: InterceptorData): IEventEmitter {
        let res: IEventEmitter;
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
                if (params.Data.DataObject instanceof Transaction) {
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