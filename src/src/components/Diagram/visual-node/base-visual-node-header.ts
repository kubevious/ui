import { Header } from "../types"
import VisualNode from "./visual-node"
import VisualView from "../visual-view"

export default class BaseVisualNodeHeader {
  _node: VisualNode
  _headerName: string
  _flavor: string | undefined
  constructor(node: VisualNode, headerName: string, flavor?: string) {
      this._node = node
      this._headerName = headerName
      this._flavor = flavor
  }

  get view(): VisualView {
      return this._node.view;
  }

  get node(): VisualNode {
      return this._node
  }

  get headerName(): string {
      return this._headerName
  }

  get header(): Header | null {
      return this.node.getHeader(this.headerName)
  }

  x(): number {
      return this.node.getHeaderX(this.headerName, this._flavor)
  }

  y(): number {
      return this.node.getHeaderY(this.headerName, this._flavor)
  }

  translateTransform(): string {
      return 'translate(' + this.x() + ',' + this.y() + ')';
  }

  width(): number {
      var header = this.header
      if (!header) {
          // TODO: Error
          return 0
      }
      if (this._flavor) {
          return header[this._flavor].width
      }
      return header.width || 0
  }

  height(): number {
      var header = this.header
      if (!header) {
          // TODO: Error
          return 0
      }
      if (this._flavor) {
          return header[this._flavor].height
      }
      return header.height || 0
  }

  transform(): string {
      return 'translate(' +
          this.node.getHeaderX(this.headerName, this._flavor) + ',' +
          this.node.getHeaderY(this.headerName, this._flavor) + ')'
  }
}
