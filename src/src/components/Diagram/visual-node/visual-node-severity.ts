import { BaseVisualNodeHeader } from "./base-visual-node-header"
import { VisualNode } from "./visual-node"

export class VisualNodeSeverity extends BaseVisualNodeHeader {
    private _fill: string
    constructor(
        node: VisualNode,
        headerName: string,
        flavor: string,
        fill: string
    ) {
        super(node, headerName, flavor)
        this._fill = fill
    }

    get fill(): string {
        return this._fill
    }
}
