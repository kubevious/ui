import _ from 'lodash'

import {
    ABOUT_DATA,
    ALERTS_DATA,
    GRAPH_DATA, HISTORY_GRAPH_DATA, HISTORY_PROPERTIES,
    HISTORY_RANGE, HISTORY_TIMELINE,
    PROPERTIES_DATA,
    DN_LIST
} from '../boot/diagramMockData'

class MockWebSocketService
{
    constructor(state)
    {
        this.sharedState = state;
        this._readGraphData();
    }

    _readGraphData()
    {
        this._nodeData = {};
        this._nodeChildren = {};

        var traverse = (parentDn, node) => {
            var dn;
            if (parentDn) {
                dn = parentDn + '/' + node.rn;
            } else {
                dn = node.rn;
            }

            this._nodeData[dn] = {
                rn: node.rn,
                kind: node.kind,
                name: node.name,
                order: node.order,
                alertCount: node.alertCount,
                flags: _.keys(node.flags),
                markers: node.markers,
                childrenCount: 0
            };

            this._nodeChildren[dn] = [];

            if (node.children) {
                this._nodeData[dn].childrenCount = node.children.length;
                for(var childNode of node.children)
                {
                    var childDn = traverse(dn, childNode);
                    this._nodeChildren[dn].push(childDn);
                }
            }
            return dn;
        };
        traverse(null, GRAPH_DATA);

        console.log("NODE DATA", this._nodeData);
        console.log("NODE CHILDREN DATA", this._nodeChildren);
    }

    _setup()
    {
        this._setupDiagram();
    }

    _setupDiagram()
    {

    }

    scope(cb)
    {
        return {
            replace: (subscriptions) => {
                console.log("******** SUBSCRIBE: ", subscriptions);
                this._handleSubscriptions(subscriptions, cb);
            }
        }
    }

    _handleSubscriptions(subscriptions, cb)
    {
        for(var x of subscriptions)
        {
            var item = this._getItem(x);
            if (item) {
                cb(item.value, item.target);
            }
        }
    }

    _getItem(subscription)
    {
        if(subscription.kind == 'node')
        {
            var value = this._nodeData[subscription.dn];
            if (!value) {
                return;
            }
    
            return {
                target: { dn: subscription.dn},
                value: value
            }
        }
        else if(subscription.kind == 'children')
        {
            var value = this._nodeChildren[subscription.dn];
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

export default MockWebSocketService;