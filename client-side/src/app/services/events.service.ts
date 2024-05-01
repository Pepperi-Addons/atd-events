import { Injectable } from "@angular/core";
import { PepAddonService } from "@pepperi-addons/ngx-lib";
import { config } from "../addon.config";

@Injectable()
export class EventsService {

    constructor(private addonService: PepAddonService) { }

    getTransactionEvents(atdUUID: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.addonService.getAddonApiCall(config.AddonUUID, 'api', `get_transactions_events?type_uuid=${atdUUID}`).subscribe(events => {
                resolve(events);
            });
        });
    }

    async getEvents(draftKey: string): Promise<number> {
        return await this.addonService.getAddonApiCall(config.AddonUUID, 'api', `get_events?draft_key=${draftKey}`).toPromise();
    }

}