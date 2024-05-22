import { Injectable } from "@angular/core";
import { PepAddonService, PepHttpService } from "@pepperi-addons/ngx-lib";
import { config } from "../addon.config";
import { Draft } from "@pepperi-addons/papi-sdk";
import { ATDEventForUI, ATDEventForDraft } from "shared";
import { lastValueFrom } from "rxjs";

@Injectable()
export class EventsService {

    constructor(private addonService: PepAddonService, private httpService: PepHttpService) { }

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

    async getDraft(draftKey: string): Promise<Draft> {
        return await this.addonService.getAddonApiCall(config.AddonUUID, 'api', `draft?draft_key=${draftKey}`).toPromise();
    }
    
    async upsertEvent(eventObj: Draft) {
        return await this.addonService.postAddonApiCall(config.AddonUUID, 'api', 'draft', eventObj).toPromise();
    }

    async searchFlows(flowKey: string): Promise<any> {
        return lastValueFrom(await this.httpService.postPapiApiCall('/user_defined_flows/search', { KeyList: [flowKey], Fields: ['Key', 'Name']}));
    }
}