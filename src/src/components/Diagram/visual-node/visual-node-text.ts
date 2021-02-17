import { BaseVisualNodeHeader } from "./base-visual-node-header"
import { VisualNode } from "./visual-node"

export class VisualNodeText extends BaseVisualNodeHeader {
    constructor(node: VisualNode, headerName: string, flavor?: string) {
        super(node, headerName, flavor)
    }

    text(): string | number | undefined {
        const header = this.header
        if (!header) {
            // TODO: Error
            return ""
        }
        return header.text
    }
}
