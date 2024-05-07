
/*
The return object format MUST contain the field 'success':
{success:true}

If the result of your code is 'false' then return:
{success:false, erroeMessage:{the reason why it is false}}
The error Message is importent! it will be written in the audit log and help the user to understand what happen
*/

import { Client, Request } from '@pepperi-addons/debug-server'
import { AtdRelations } from './metadata'
import { UtilitiesService } from './services/utilities-service'
import { atdFlowsConfigurationSchema } from 'shared';
import semver from 'semver';

export async function install(client: Client, request: Request): Promise<any> {
    return await createObjects(client);
}

export async function uninstall(client: Client, request: Request): Promise<any> {
    return { success: true, resultObject: {} }
}

export async function upgrade(client: Client, request: Request): Promise<any> {
    if (request.body.FromVersion && semver.compare(request.body.FromVersion, '0.6.6') < 0) {
        const service = new UtilitiesService(client);
        await service.createConfigurationSchema(atdFlowsConfigurationSchema);
        return await createObjects(client);
    }
    else {
        return { success: true, resultObject: {} }

    }
}

export async function downgrade(client: Client, request: Request): Promise<any> {
    return { success: true, resultObject: {} }
}


async function createObjects(client: Client) {
    try {
        const service = new UtilitiesService(client);
        await service.createRelations(AtdRelations);
        await service.createConfigurationSchema(atdFlowsConfigurationSchema);
        return {
            success: true,
            resultObject: {}
        }
    }
    catch (err) {
        return {
            success: false,
            resultObject: err,
            errorMessage: `Error in creating necessary objects . error - ${err}`
        };
    }
}
