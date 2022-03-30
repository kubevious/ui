import { ISharedState } from "@kubevious/ui-framework"
import { IWebSocketService, WebSocketScope } from "@kubevious/ui-middleware"

export class AlertsSource {
    private _sharedState: ISharedState
    private _socketScope: WebSocketScope;

    constructor(sharedState: ISharedState, socket: IWebSocketService) {
        if (!sharedState) {
            throw new Error("SharedState not provided")
        }
        if (!socket) {
            throw new Error("SocketService not provided")
        }

        this._sharedState = sharedState.user();

        this._socketScope = socket.scope((value, target) => {
            if (target.dn === this._sharedState.get('selected_dn')) {
                this._sharedState.set('selected_object_alerts', value);
            }
        });

        this._sharedState.subscribe('selected_dn',
            (selected_dn) => {

                const wsSubscriptions: any[] = []

                if (selected_dn) {
                    wsSubscriptions.push({ kind: 'alerts', dn: selected_dn });
                } else {
                    this._sharedState.set('selected_object_alerts', []);
                }

                this._socketScope.replace(wsSubscriptions);
            })
    }

    close() {
        this._socketScope.close();
        this._sharedState.close();

        this._sharedState.set('selected_object_alerts', []);
    }
}
