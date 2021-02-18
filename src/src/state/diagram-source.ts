import { SharedState } from "@kubevious/ui-framework/dist"
import { IWebSocketService } from "@kubevious/ui-middleware/dist"
import _ from "the-lodash"

export class DiagramSource {
    private _sharedState: SharedState
    private _socket: IWebSocketService
    private _delayedActions: {}
    private _nodeData: {}
    private _nodeChildren: {}
    private _nodesScope: any
    private _childrenScope: any
    constructor(sharedState: SharedState, socket: IWebSocketService) {
        if (!sharedState) {
            throw new Error("SharedState not provided")
        }
        if (!socket) {
            throw new Error("SocketService not provided")
        }

        this._sharedState = sharedState
        this._socket = socket

        this._delayedActions = {}

        this._nodeData = {}
        this._nodeChildren = {}

        this._setupSocketSubscriptions()

        this._sharedState.subscribe(
            "diagram_expanded_dns",
            (diagram_expanded_dns) => {
                this._updateSubscriptions()
                this._handleTreeChange()
            }
        )

        this._sharedState.subscribe(
            "time_machine_enabled",
            (time_machine_enabled) => {
                if (!time_machine_enabled) {
                    this._handleTreeChange()
                }
            }
        )
    }

    close() {
        this._sharedState.close()
        this._socket.close()
    }

    getChildren(dn: string | number) {
        if (this._nodeChildren[dn]) {
            return this._nodeChildren[dn]
        }
        return []
    }

    _setupSocketSubscriptions() {
        this._nodesScope = this._socket.scope((value, target) => {
            if (value) {
                this._nodeData[target.dn] = value
            } else {
                delete this._nodeData[target.dn]
            }

            this._handleTreeChange()
        })
        this._childrenScope = this._socket.scope((value, target) => {
            const expandedObjects = this._sharedState.get(
                "diagram_expanded_dns"
            )
            if (expandedObjects[target.dn]) {
                if (value) {
                    this._nodeChildren[target.dn] = value
                } else {
                    delete this._nodeChildren[target.dn]
                }

                this._updateMonitoredObjects()
            }

            this._handleTreeChange()
        })
    }

    _updateSubscriptions() {
        this._updateMonitoredObjects()
        this._updateChildrenSubscriptions()
    }

    _updateChildrenSubscriptions() {
        this._executeDelayedAction("update-ws-children-subscription", () => {
            const expandedObjects = this._sharedState.get(
                "diagram_expanded_dns"
            )

            this._childrenScope.replace(
                _.keys(expandedObjects).map((x: any) => ({
                    kind: "children",
                    dn: x,
                }))
            )
        })
    }

    _updateMonitoredObjects() {
        this._executeDelayedAction("update-monitored-objects", () => {
            const monitoredObjects = {}

            this._traverseTree((dn: string | number) => {
                monitoredObjects[dn] = true
            })

            this._nodesScope.replace(
                _.keys(monitoredObjects).map((x: any) => ({
                    kind: "node",
                    dn: x,
                }))
            )
        })
    }

    _handleTreeChange() {
        if (this._sharedState.get("time_machine_enabled")) {
            return
        }

        this._executeDelayedAction("build-tree", () => {
            if (this._sharedState.get("time_machine_enabled")) {
                return
            }

            const tree = this._buildTreeData()
            this._sharedState.set("diagram_data", tree)
        })
    }

    _buildTreeData() {
        let treeNodes = {}
        this._traverseTree((dn: string | number, parentDn: string | number) => {
            let nodeData = this._nodeData[dn]
            if (nodeData) {
                nodeData = _.clone(nodeData)
                nodeData.children = []
                treeNodes[dn] = nodeData

                if (parentDn) {
                    if (treeNodes[parentDn]) {
                        treeNodes[parentDn].children.push(nodeData)
                    }
                }
            }
        })

        let tree = treeNodes["root"]
        if (!tree) {
            tree = {
                rn: "root",
                kind: "root",
                order: 100,
                alertCount: {},
            }
        }

        return tree
    }

    _executeDelayedAction(
        name: string,
        action: { (): void; (): void; (): void; (): void },
        timeout?: number
    ) {
        if (this._delayedActions[name]) {
            return
        }
        this._delayedActions[name] = true
        timeout = timeout || 20
        setTimeout(() => {
            this._delayedActions[name] = false
            action()
        }, timeout)
    }

    _traverseTree(cb) {
        const expandedDns = this._sharedState.get("diagram_expanded_dns")

        const traverseNode = (dn: string, parentDn: string | null) => {
            cb(dn, parentDn)

            if (expandedDns[dn]) {
                for (const child of this.getChildren(dn)) {
                    traverseNode(child, dn)
                }
            }
        }

        traverseNode("root", null)
    }
}
