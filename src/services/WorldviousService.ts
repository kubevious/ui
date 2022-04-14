import { BaseHttpService, HttpClient } from '@kubevious/ui-framework';
import { IWorldviousService, IWebSocketService, WebSocketKind } from '@kubevious/ui-middleware';
import { app } from '@kubevious/ui-framework';

import { WorldviousFeedbackSnoozeData, WorldviousFeedbackSubmitData, WorldviousNotificationsInfo, WorldviousVersionInfoResult } from '@kubevious/ui-middleware/dist/services/worldvious';

export class WorldviousService extends BaseHttpService implements IWorldviousService {

    private _ws : IWebSocketService;

    constructor(client: HttpClient)
    {
        super(client);

        this._ws = app.serviceRegistry.resolveService({ kind: 'socket' });
    }

    close()
    {
        super.close();
        this._ws.close();
    }

    getNotificationInfo()
    {
        return this.client
            .get<WorldviousNotificationsInfo>("/notifications-info")
            .then((result) => result.data);
    }

    getNotifications()
    {
        return this.client
            .get<WorldviousVersionInfoResult>("/notifications")
            .then((result) => result.data);
    }

    subscribeToNotificationInfo(cb: (data: WorldviousNotificationsInfo) => void)
    {
        this._ws.subscribe({ kind: WebSocketKind.worldvious_updates }, (value) => {
            cb(value);
        })
    }

    submitFeedback(data: WorldviousFeedbackSubmitData)
    {
        return this.client
            .post("/feedback", {}, data)
            .then((result) => result.data);
    }

    submitSnooze(data: WorldviousFeedbackSnoozeData)
    {
        return this.client
            .post("/notification/snooze", {}, data)
            .then((result) => result.data);
    }


    // private _setupWebSocket()
    // {
    //     this._subscribeSocketToSharedState(
    //         'notifications_info',
    //         { kind: 'notifications-info' },
    //         { count: 0 });

    //     this._subscribeSocketToSharedState(
    //         'notifications',
    //         { kind: 'notifications' },
    //         { notifications: []});            
    // }
}
