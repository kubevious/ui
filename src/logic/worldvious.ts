import { app } from "@kubevious/ui-framework"
import { IWorldviousService } from "@kubevious/ui-middleware"

export function setupWorldvious()
{
    const service = app.serviceRegistry.resolveService<IWorldviousService>({ kind: 'worldvious' });

    service.subscribeToNotificationInfo((data) => {
        app.sharedState.set('notifications_info', data);
    })
}