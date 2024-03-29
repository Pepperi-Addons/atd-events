import { EventsNames } from "shared";
import { InterceptorData } from "../metadata";
import { TransactionScopeEventEmitter } from "./transaction-scope-emitter";

export class TransactionScopeLoadedEventEmitter extends TransactionScopeEventEmitter {

    constructor(params: InterceptorData) {
        super(params);
    }

    protected getEventKey(): EventsNames {
        return 'OnTransactionLoaded'
    }
}