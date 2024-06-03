import '@pepperi-addons/cpi-node'
import { SubscriptionService } from './services/subscription-service';

export const router = Router();

export async function load(configuration: any) {
    const service = new SubscriptionService();

    await service.registerEvents();
}
