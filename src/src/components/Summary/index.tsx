import React from "react"
import { BaseComponent, IService } from "@kubevious/ui-framework"
import { PropertiesContents } from "../Properties/PropertiesContents"
import "./styles.scss"
import { isEmptyObject } from "../../utils/util"

export class Summary extends BaseComponent<IService> {
    constructor(props) {
        super(props)

        this.state = {
            data: {},
        }
    }

    componentDidMount() {
        this.subscribeToSharedState("summary", (data) => {
            this.setState({ data })
        })
    }

    render() {
        const { data } = this.state as any
        if (!isEmptyObject(data)) {
            return (
                <div id="summaryComponent" className="summary">
                    {Object.values(data).map((block: any) => (
                        <div className="summary-container" key={block.id}>
                            <label>{block.title}</label>
                            <div className="summary-container-inner">
                                <PropertiesContents group={block} />
                            </div>
                        </div>
                    ))}
                </div>
            )
        }
        return (
            <div id="summaryComponent" className="loading-placeholder">
                Loading...
            </div>
        )
    }
}
