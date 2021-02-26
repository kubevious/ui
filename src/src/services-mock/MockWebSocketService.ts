import _ from 'the-lodash'

import { MockRootApiService } from './MockRootApiService';

import { ISharedState } from '@kubevious/ui-framework'

import { IWebSocketService } from '@kubevious/ui-middleware'

import { GRAPH_DATA } from '../boot/diagramMockData'
import { WebSocketTarget, WebSocketSubscription, WebSocketScope } from '@kubevious/ui-middleware/dist/services/websocket';

export class MockWebSocketService implements IWebSocketService
{
    private parent: MockRootApiService;
    private sharedState : ISharedState;

    private _nodeData : Record<string, any> = {};
    private _nodeChildren : Record<string, string[]> = {};

    constructor(parent: MockRootApiService, sharedState: ISharedState)
    {
        this.parent = parent;
        this.sharedState = sharedState;

        this._readGraphData();
    }

    close()
    {
      
    }

    private _readGraphData()
    {
        this._nodeData = {};
        this._nodeChildren = {};

        let traverse = (parentDn, node) => {
            let dn;
            if (parentDn) {
                dn = parentDn + '/' + node.rn;
            } else {
                dn = node.rn;
            }

            let graphNode = {
                dn: dn,
                rn: node.rn,
                kind: node.kind,
                name: node.name,
                order: node.order,
                alertCount: node.alertCount,
                flags: _.keys(node.flags),
                markers: node.markers,
                childrenCount: 0
            };

            this._nodeData[dn] = graphNode;
            this._nodeChildren[dn] = [];

            if (node.children) {
                graphNode.childrenCount = node.children.length;
                for(let childNode of node.children)
                {
                    let childGraphNode = traverse(dn, childNode);
                    for(let severity of _.keys(childGraphNode.alertCount))
                    {
                        if (graphNode.alertCount[severity]) {
                            graphNode.alertCount[severity] += childGraphNode.alertCount[severity];
                        } else {
                            graphNode.alertCount[severity] = childGraphNode.alertCount[severity];
                        }
                    }

                    this._nodeChildren[dn].push(childGraphNode.dn);
                }
            }
            return graphNode;
        };
        traverse(null, GRAPH_DATA);

        console.log("NODE DATA", this._nodeData);
        console.log("NODE CHILDREN DATA", this._nodeChildren);
    }

    scope(cb: (value: any, target: WebSocketTarget) => any) : WebSocketScope
    {
        return {
            close: () => {

            },
            subscribe: (target: WebSocketTarget) => {

            },
            unsubscribe: (target: WebSocketTarget) => {

            },
            replace: (newTargets: WebSocketTarget[]) => {
                this._handleSubscriptions(newTargets, cb)
            }
        }
    }

    subscribe(target: WebSocketTarget, cb: (value: any) => any) : WebSocketSubscription
    {
        return {
            close: () => {

            }
        }
    }

    private _handleSubscriptions(subscriptions: WebSocketTarget[], cb: (value: any, target: WebSocketTarget) => any)
    {
        for(let x of subscriptions)
        {
            let item = this._getItem(x);
            if (item) {
                cb(item.value, item.target);
            }
        }
    }

    private _getItem(subscription)
    {
        if(subscription.kind === 'node')
        {
            let value = this._nodeData[subscription.dn];
            if (!value) {
                return;
            }

            return {
                target: { dn: subscription.dn},
                value: value
            }
        }
        else if(subscription.kind === 'children')
        {
            let value = this._nodeChildren[subscription.dn];
            if (!value) {
                return;
            }

            return {
                target: { dn: subscription.dn},
                value: value
            }
        }
    }
}
