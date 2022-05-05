import { app } from "@kubevious/ui-framework"
import { IWorldviousService } from "@kubevious/ui-middleware"
import { WorldviousNotificationsInfo } from '@kubevious/ui-middleware/dist/services/worldvious';

export function setupWorldvious()
{
    const service = app.serviceRegistry.resolveService<IWorldviousService>({ kind: 'worldvious' });

    service.subscribeToNotificationInfo((data) => {
        app.sharedState.set('notifications_info', data);
    })
}


export function hasWorldviousUpdates()
{
    const info = app.sharedState.tryGet<WorldviousNotificationsInfo>('notifications_info');
    if (!info) {
        return false;
    }
    return (info.count ?? 0) > 0;
}