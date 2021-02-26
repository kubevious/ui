import _ from 'the-lodash';
import { BaseService } from './BaseService'
import { IMiscService } from '@kubevious/ui-middleware/dist';
import { version } from '../version';

export class MiscService extends BaseService implements IMiscService {

    constructor(client, sharedState, socket)
    {
        super(client, sharedState, socket)

        this._setupWebSocket();
    }

    fetchAbout(cb: (data: any) => any) : void {
        let info : any[] = [];

        info.push({
            name: 'UI Version',
            value: version
        })

        Promise.resolve()
            .then(() => {
                return this.client.get('/api/v1/version')
                    .then(result => {
                        return result.data.version;
                    })
                    .catch(reason => {
                        return "unknown";
                    });
            })
            .then(result => {
                info.push({
                    name: 'Backend Version',
                    value: result
                })
            })
            .then(() => {
                return this.client.get('/api/v1/metrics')
                    .then(result => {
                        info = _.concat(info, result.data.metrics);
                    })
                    .catch(reason => {
                        console.error(reason);
                    });
            })
            .then(() => {
                cb(info);
                return null;
            });
    }

    fetchNotifications(cb: (data: any) => any) : void {
        this.client.get('/api/v1/support/notifications')
            .then(result => {
                cb(result.data)
                return null;
            })
    }

    submitFeedback(data: any, cb: (data: any) => any) : void {
        this.client.post('/api/v1/support/feedback', data)
            .then(result => {
                cb(result.data)
                return null;
            })
    }

    submitSnooze(data: any, cb: (data: any) => any) : void {
        this.client.post('/api/v1/support/notification/snooze', data)
            .then(result => {
                cb(result.data)
                return null;
            })
    }

    private _setupWebSocket()
    {
        this._subscribeSocketToSharedState(
            'notifications_info',
            { kind: 'notifications-info' },
            { count: 0 });

        this._subscribeSocketToSharedState(
            'notifications',
            { kind: 'notifications' },
            { notifications: []});            
    }
}
