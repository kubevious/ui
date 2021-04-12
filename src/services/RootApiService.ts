import _ from 'the-lodash'

import { WebSocketService } from './WebSocketService'
import { DiagramService } from './DiagramService'
import { SearchService } from './SearchService'
import { RuleService } from './RuleService'
import { MarkerService } from './MarkerService'
import { MiscService } from './MiscService'
import { UserService } from './UserService';

import { app } from '@kubevious/ui-framework';

export class RootApiService {
    constructor() {

        app.initHttpClient('');

        app.registerService({ kind: 'socket' }, () => {
            return new WebSocketService();
        });

        app.registerService({ kind: 'rule' }, () => {
            const client = app.httpClient('/api/v1');
            return new RuleService(client, this.socketService());
        });

        app.registerService({ kind: 'marker' }, () => {
            const client = app.httpClient('/api/v1');
            return new MarkerService(client, this.socketService());
        });

        app.registerService({ kind: 'diagram' }, () => {
            const client = app.httpClient('/api/v1');
            return new DiagramService(client, this.socketService());
        });

        app.registerService({ kind: 'search' }, () => {
            const client = app.httpClient('/api/v1');
            return new SearchService(client, this.socketService());
        });

        app.registerService({ kind: 'misc' }, () => {
            const client = app.httpClient('');
            return new MiscService(client, this.socketService());
        });

        app.registerService({ kind: 'user' }, () => {
            const client = app.httpClient('/api/v1');
            return new UserService(client);
        });
    }

    socketService() {
        return app.serviceRegistry.resolveService<WebSocketService>({ kind: 'socket' });
    }

    ruleService() {
        return app.serviceRegistry.resolveService<RuleService>({ kind: 'rule' });
    }

    markerService() {
        return app.serviceRegistry.resolveService<MarkerService>({ kind: 'marker' });
    }

    diagramService(params) {
        let info;
        if (params) {
            info = _.clone(params);
        } else {
            info = {}
        }
        info.kind = 'diagram';
        return app.serviceRegistry.resolveService<DiagramService>(info);
    }

    miscService() {
        return app.serviceRegistry.resolveService<MiscService>({ kind: 'misc' });
    }

    userService() {
        return app.serviceRegistry.resolveService<UserService>({ kind: 'developer' });
    }
}
