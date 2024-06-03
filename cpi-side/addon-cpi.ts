import '@pepperi-addons/cpi-node'
import { SubscriptionService } from './services/subscription-service';
import { atdFlowsConfigurationSchemaName } from 'shared';
import { AddonUUID } from '../addon.config.json'
import { Relation } from '@pepperi-addons/papi-sdk';

export const router = Router();

export async function load(configuration: any) {
    let relation: Relation = {
        Type: "CPIAddonAPI",
        AddonRelativeURL: "/addon-cpi/after_sync_registration",
        AddonUUID: AddonUUID,
        RelationName: "AfterSync",
        Name: "atd_events_after_sync_registration",
    }

    await pepperi.addons.data.relations.upsert(relation);
    const service = new SubscriptionService();
    await service.registerEvents();
}

router.post('/after_sync_registration', async (req, res, next) => {
    shouldReload(req).then(shouldReload => {
        res.json({
            ShouldReload: shouldReload
        });
    }).catch(next);
})

async function shouldReload(req) {
    const lastSyncTime = req.body.JobInfoResponse.ClientInfo.
    FormattedLastSyncDateTime;
    debugger;
    const drafts = await pepperi.addons.configurations.uuid(AddonUUID).schema(atdFlowsConfigurationSchemaName).get();
    const modified = drafts.filter(draft => {
        return draft.ModificationDateTime! > lastSyncTime
    })
    let shouldReload = modified && modified.length > 0
    console.log(`shouldReload => return value: ${shouldReload}`);
    return shouldReload;
}