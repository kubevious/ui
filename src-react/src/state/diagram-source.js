import _ from 'lodash'
import uuid from "uuid";

class DiagramSource
{
    constructor(service)
    {
        this._service = service;
        this._socket = service.socket;
        this._diagramChangeHandlers = {};

        this._currentTree = null;
        this._delayedActions = {};

        this._monitoredObjects = {};
        this._expandedObjects = {};

        this._nodeData = {};
        this._nodeChildren = {};

        this._setupSubscriptions();

        this.setExpanded('root', true);

        this._handleTreeChange();
    }

    subscribe(cb)
    {
        var id = uuid();
        this._diagramChangeHandlers[id] = {
            _handler: cb,
            close: () => {
                delete this._diagramChangeHandlers[id];
            }
        }

        if (this._currentTree) {
            cb(this._currentTree);
        }
     }

    getExpanded(dn)
    {
        if (this._expandedObjects[dn]) {
            return true
        }
        return false
    }

    setExpanded(dn, value)
    {
        console.log("[SET-EXPANDED] " + dn + ' :: ' + value);
        if (value) {
            this._expandedObjects[dn] = true;
        } else {
            delete this._expandedObjects[dn];

            if (this._nodeChildren[dn])
            {
                for(var x of this._nodeChildren[dn])
                {
                    delete this._nodeData[x];
                }
                delete this._nodeChildren[dn];
            }
        }
        this._updateSubscriptions();
        this._handleTreeChange();
    }

    getChildren(dn)
    {
        if (this._nodeChildren[dn]) {
            return this._nodeChildren[dn];
        }
        return [];
    }

    _setupSubscriptions()
    {
        this._nodesScope = this._socket.scope((value, target) => {

            if (value) {
                this._nodeData[target.dn] = value;
            } else {
                delete this._nodeData[target.dn];
            }
            
            this._handleTreeChange();

        });

        this._childrenScope = this._socket.scope((value, target) => {

            if (this.getExpanded(target.dn))
            {
                if (value) {
                    this._nodeChildren[target.dn] = value;
                } else {
                    delete this._nodeChildren[target.dn];
                }

                this._updateMonitoredObjects();
            }

            this._handleTreeChange();
        });
    }

    _updateSubscriptions()
    {
        this._updateMonitoredObjects();
        this._updateChildrenSubscriptions();
    }

    _updateNodeSubscriptions()
    {
        this._executeDelayedAction('update-ws-node-subscription', 
            () => {
                this._nodesScope.replace(_.keys(this._monitoredObjects).map(x => ({
                    kind: 'node',
                    dn: x
                })));
            });
    }

    _updateChildrenSubscriptions()
    {
        this._executeDelayedAction('update-ws-children-subscription', 
            () => {
                this._childrenScope.replace(_.keys(this._expandedObjects).map(x => ({
                    kind: 'children',
                    dn: x
                })));
            });
    }

    _updateMonitoredObjects()
    {
        this._executeDelayedAction('build-monitored-objects', 
            () => {
                this._buildMonitoredObjects();
            });
    }

    _buildMonitoredObjects()
    {
        this._monitoredObjects = {};
        this._traverseTree((dn) => {
            this._monitoredObjects[dn] = true;
        })
        this._updateNodeSubscriptions();
    }

    _handleTreeChange()
    {
        this._executeDelayedAction('build-tree', 
            () => {
                this._currentTree = this._buildTreeData();
                // console.log(this._currentTree);

                for(var x of _.values(this._diagramChangeHandlers))
                {
                    x._handler(this._currentTree);
                }
            });
    }

    _buildTreeData()
    {
        var treeNodes = {};
        this._traverseTree((dn, parentDn) => {
            var nodeData = this._nodeData[dn];
            if (nodeData) 
            {
                nodeData = _.clone(nodeData);
                nodeData.children = [];
                treeNodes[dn] = nodeData;

                if (parentDn)
                {
                    if (treeNodes[parentDn])
                    {
                        treeNodes[parentDn].children.push(nodeData);
                    }
                }
            }
        });

        var tree = treeNodes['root'];
        if (!tree) {
            tree = {
                "rn": "root",
                "kind": "root",
                "order": 100,
                "alertCount": {}
            };
        }

        return tree;
    }

    _executeDelayedAction(name, action, timeout)
    {
        if (this._delayedActions[name]) {
            return;
        }
        this._delayedActions[name] = true;
        timeout = timeout || 20;
        setTimeout(() => {
            this._delayedActions[name] = false;
            action();
        }, timeout);
    }

    _traverseTree(cb)
    {
        var traverseNode = (dn, parentDn) => {
            cb(dn, parentDn);

            if (this.getExpanded(dn))
            {
                for(var child of this.getChildren(dn))
                {
                    traverseNode(child, dn);
                }
            }
        }

        traverseNode('root', null);
    }
}

export default DiagramSource;