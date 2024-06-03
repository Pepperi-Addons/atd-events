import { Injectable, ViewContainerRef } from "@angular/core";
import { PepAddonService, PepHttpService } from "@pepperi-addons/ngx-lib";
import { config } from "../addon.config";
import { Draft, SchemeField } from "@pepperi-addons/papi-sdk";
import { ATDEventForUI, FlowObject } from "shared";
import { lastValueFrom } from "rxjs";
import { PepAddonBlockLoaderService } from "@pepperi-addons/ngx-lib/remote-loader";
import { UserEvent } from "../entities";

@Injectable()
export class EventsService {

    constructor(private addonService: PepAddonService, private httpService: PepHttpService, private addonLoaderService: PepAddonBlockLoaderService
    ) { }

    getTransactionEvents(atdUUID: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.addonService.getAddonApiCall(config.AddonUUID, 'api', `get_transactions_events?type_uuid=${atdUUID}`).subscribe(events => {
                resolve(events);
            });
        });
    }

    async getEvents(draftKey: string): Promise<ATDEventForUI[]> {
        return await this.addonService.getAddonApiCall(config.AddonUUID, 'api', `get_events?draft_key=${draftKey}`).toPromise();
    }

    async getUIData(atdUUID: string): Promise<{ Draft: Draft, PossibleEvents: UserEvent[] }> {
        return await this.addonService.getAddonApiCall(config.AddonUUID, 'api', `get_ui_data?atd_uuid=${atdUUID}`).toPromise();
    }
    
    async upsertEvent(eventObj: Draft) {
        return await this.addonService.postAddonApiCall(config.AddonUUID, 'api', 'draft', eventObj).toPromise();
    }

    async searchFlows(flowKey: string): Promise<any> {
        return lastValueFrom(await this.httpService.postPapiApiCall('/user_defined_flows/search', { KeyList: [flowKey], Fields: ['Key', 'Name']}));
    }

    chooseFlow(viewContainer: ViewContainerRef, fields: { [key: string]: SchemeField }, runFlowData: FlowObject, callback: (event?: { data: FlowObject }) => void) {
        const dialogRef = this.addonLoaderService.loadAddonBlockInDialog({
            container: viewContainer,
            name: 'FlowPicker',
            hostObject: {
                fields: fields,
                runFlowData: runFlowData
            },
            hostEventsCallback: (event) => {
                callback(event);
                dialogRef.close();
            },
            size: 'large'
        })
      }
}