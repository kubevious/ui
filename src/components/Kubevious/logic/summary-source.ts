import { ISharedState } from "@kubevious/ui-framework"
import { IWebSocketService, WebSocketScope, WebSocketKind } from "@kubevious/ui-middleware"

export class SummarySource {
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
            this._sharedState.set('summary', value);
        });
        this._socketScope.replace([{ kind: WebSocketKind.props, dn: 'summary' }]);
    }

    close() {
        this._socketScope.close();
        this._sharedState.close();

        this._sharedState.set('summary', null);
    }
}
