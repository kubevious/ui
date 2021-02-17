import React from "react"
import { ClassComponent } from "@kubevious/ui-framework"
import { VisualView } from "./visual-view/visual-view"
import * as d3 from "d3"
import $ from "jquery"

import "./styles.scss"
import { DiagramData } from "../../types"

import { IDiagramService } from "@kubevious/ui-middleware"

export class Diagram extends ClassComponent<{}, {}, IDiagramService> {
    view: VisualView
    private _sourceData: DiagramData | undefined
    constructor(props) {
        super(props, { kind: "diagram" })

        this.view = new VisualView(d3.select("#diagram"), this.sharedState)

        this.subscribeToSharedState(
            "diagram_data",
            (diagram_data: DiagramData) => {
                if (diagram_data) {
                    this._acceptSourceData(diagram_data)
                }
            }
        )
    }

    componentDidMount(): void {
        this._setupView()

        $(".lm_content").each(() => {
            if ($(this).children().hasClass("diagram")) {
                $(this).css("overflow", "hidden")
            }
        })
    }

    _acceptSourceData(sourceData: DiagramData): void {
        this.massageSourceData(sourceData)
        this._sourceData = sourceData

        this._renderData()
    }

    massageSourceData(data: DiagramData): void {
        this._massageSourceDataNode(data, null)
    }

    _massageSourceDataNode(
        node: DiagramData,
        parent: DiagramData | null
    ): void {
        if (!node.dn) {
            var dn: string
            if (parent) {
                dn = parent.dn + "/" + node.rn
            } else {
                dn = node.rn || ""
            }
            node.dn = dn
        }

        if (node.children) {
            for (var child of node.children) {
                this._massageSourceDataNode(child, node)
            }
        }
    }

    _setupView(): void {
        this.view = new VisualView(d3.select("#diagram"), this.sharedState)
        this.view.skipShowRoot()
        this.view.setup()
        this._renderData()
    }

    _renderData(): void {
        if (!this.view) {
            return
        }
        if (this._sourceData) {
            this.view.acceptSourceData(this._sourceData)
        }
        this.view.updateAll(true)
    }

    render() {
        return <div id="diagram" className="diagram" />
    }
}
