import BaseVisualNodeHeader from "./base-visual-node-header"
import VisualNode from "./visual-node"

export class VisualNodeHeaderMarker extends BaseVisualNodeHeader {
  _marker: string
  _flavor: string
  constructor(node: VisualNode, marker: string) {
      super(node, 'marker-' + marker)

      this._marker = marker;
      this._flavor = 'marker';
  }

  get marker(): string {
      return this._marker
  }

  fill(): string {
      var marker = this.view._markerData[this.marker];
      if (marker) {
          return marker.color;
      }
      return 'white';
  }

  html(): string {
      var marker = this.view._markerData[this.marker];
      if (marker) {
          if (marker.shape) {
              return '&#x' + marker.shape + ';';
          }
      }
      return '';
  }
}
