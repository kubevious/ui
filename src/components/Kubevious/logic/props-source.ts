import _ from 'the-lodash';
import { ISharedState } from "@kubevious/ui-framework"
import { IWebSocketService, WebSocketScope } from "@kubevious/ui-middleware"
import { WebSocketKind } from '../../../services/types'
import { SnapshotPropsConfig } from '@kubevious/state-registry';
import { PropsId, PropsKind } from '@kubevious/entity-meta';

export class PropertiesSource {
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
            if (target.dn === this._sharedState.tryGet('selected_dn')) {
                this._applyProps(target.dn, value);
            }
        });

        this._sharedState.subscribe('selected_dn',
            (selected_dn) => {

                const wsSubscriptions: any[] = []

                if (selected_dn) {
                    wsSubscriptions.push({ kind: WebSocketKind.props, dn: selected_dn });
                } else {
                    this._applyProps();
                }

                this._socketScope.replace(wsSubscriptions);
            })
    }

    private _applyProps(dn? : string, props?: SnapshotPropsConfig[])
    {
        if (dn && props) {
            const myProps = this._enhanceProps(dn, props);
            this._sharedState.set('selected_object_props', myProps);
        } else {
            this._sharedState.set('selected_object_props', []);
        }
    }

    private _enhanceProps(dn: string, props: SnapshotPropsConfig[])
    {
        if (_.isNullOrUndefined(props)) {
            return [];
        }

        const myProps = _.clone(props);
        myProps.push({
            kind: PropsKind.ruleAssistant,
            id: PropsId.ruleAssistant,
            config: {
                dn: dn,
                props: props,
            }
        })
        return myProps;
    }


    close() {
        this._socketScope.close();
        this._sharedState.close();

        this._sharedState.set('selected_object_props', []);
    }
}
