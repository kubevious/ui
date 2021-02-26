import { BaseVisualNodeHeader } from "./base-visual-node-header"
import { VisualNode } from "./visual-node"

export class VisualNodeHeaderExpander extends BaseVisualNodeHeader {
    constructor(node: VisualNode, headerName: string) {
        super(node, headerName)
    }

    get imgSrc(): string {
        if (this.node.isExpanded) {
            return "/img/collapse.svg"
        } else {
            return "/img/expand.svg"
        }
    }
}
