import _ from 'the-lodash';

import { IDiagramBrowserService, IWebSocketService, WebSocketKind } from "@kubevious/ui-middleware"

import { DiagramChildrenChangeCallback, DiagramNodeChangeCallback, IDiagramBrowserServiceSubscriber, NodeConfig } from '@kubevious/ui-middleware/dist/services/diagram-browser';
import { makeDn } from '@kubevious/entity-meta';

export class DiagramBrowserService implements IDiagramBrowserService {

    private _ws : IWebSocketService;

    constructor(socket : IWebSocketService)
    {
        this._ws = socket;
    }

    close()
    {
        this._ws.close();
    }

    subscribeToNodes(cb: DiagramNodeChangeCallback) : IDiagramBrowserServiceSubscriber
    {
        let nodeMap : Record<string, boolean> = {};

        const nodesScope = this._ws.scope((value, target) => {
            if (!nodeMap[target.dn]) {
                return;
            }
            if (!value) {
                cb(target.dn, null);
            } else {
                const config = value as NodeConfig;
                config.dn = target.dn;
                cb(target.dn, config);
            }
        })

        const subscriber = {
            update: (dnList : string[]) => {

                for (let dn of dnList) {
                    nodeMap[dn] = true;
                }
                const newNodeMap = _.makeBoolDict(dnList);
                for (let dn of _.keys(nodeMap)) {
                    if (!newNodeMap[dn]) {
                        delete nodeMap[dn];
                        cb(dn, null);
                    }
                }

                const scopeTargets = dnList.map((x: any) => ({
                    kind: WebSocketKind.node,
                    dn: x,
                }));

                nodesScope.replace(scopeTargets)
            },
            close: () => {
                nodesScope.close();
            }
        }

        return subscriber;
    }
    
    subscribeToChildren(cb: DiagramChildrenChangeCallback) : IDiagramBrowserServiceSubscriber
    {
        let childrenMap : Record<string, boolean> = {};

        const childrenScope = this._ws.scope((value, target) => {
            if (!childrenMap[target.dn]) {
                return;
            }

            if (value) {
                const childrenRnList = value as string[];
                const childrenDnList = childrenRnList.map(x => makeDn(target.dn, x));
                cb(target.dn, childrenDnList);
            } else {
                cb(target.dn, []);
            }
        })

        const subscriber = {
            update: (dnList : string[]) => {
                for (let dn of dnList) {
                    childrenMap[dn] = true;
                }
                const newChildrenMap = _.makeBoolDict(dnList);
                for (let dn of _.keys(childrenMap)) {
                    if (!newChildrenMap[dn]) {
                        delete childrenMap[dn];
                        cb(dn, []);
                    }
                }

                childrenScope.replace(
                    dnList.map((x: any) => ({
                        kind: WebSocketKind.children,
                        dn: x,
                    }))
                )
            },
            close: () => {
                childrenScope.close();
            }   
        };

        return subscriber;
    }
}
