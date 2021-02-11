import BaseVisualNodeHeader from "./base-visual-node-header"
import VisualNode from "./visual-node"

export class VisualNodeHeaderFlag extends BaseVisualNodeHeader {
  _flag: string
  constructor(node: VisualNode, flag: string) {
      super(node, 'flag-' + flag)

      this._flag = flag
  }

  get flag(): string {
      return this._flag
  }

  get imgSrc(): string {
      var header = this.header
      if (!header) {
          // TODO: Error
          return ''
      }
      return '/img/flags/' + header.icon + '.svg'
  }
}