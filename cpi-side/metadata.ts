import { IContextWithData, MainFunction } from "@pepperi-addons/cpi-node/build/cpi-side/events";

export interface InterceptorData {
    Data: IContextWithData;
    NextFunction: (main: MainFunction) => Promise<void>;
    MainFunction: MainFunction;
}