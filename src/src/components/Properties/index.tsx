import React from "react"
import { ClassComponent } from "@kubevious/ui-framework"
import _ from "the-lodash"
import { PropertyGroup } from "./PropertyGroup"
import { DnPath } from "../GenerateDnPath"
import cx from "classnames"
import * as DnUtils from "@kubevious/helpers/dist/dn-utils"

import "./styles.scss"
import "./obsidian.css"
import { Group } from "../../types"
import { PropertiesState } from "./types"

export class Properties extends ClassComponent<{}, PropertiesState> {
    constructor(props) {
        super(props)

        this.state = {
            selectedDn: "",
            dnParts: [],
            dnKind: "",
            selectedObjectProps: [],
        }

        this._renderContent = this._renderContent.bind(this)
    }

    propertyExpanderHandleClick(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ): void {
        console.log(event.currentTarget)
        const target = event.currentTarget
        target.classList.toggle("active")
        const contentsElem =
            target.parentElement &&
            target.parentElement.getElementsByClassName("expander-contents")[0]
        contentsElem && contentsElem.classList.toggle("expander-open")
    }

    _renderPropertiesNodeDn(): JSX.Element {
        const { dnParts } = this.state
        return (
            <div className="properties-owner">
                <DnPath dnParts={dnParts} includeLogo bigLogo />
            </div>
        )
    }

    _renderContent(): JSX.Element {
        const { selectedDn, selectedObjectProps, dnKind } = this.state
        const propertyGroups = _.orderBy(selectedObjectProps, (x) => {
            if (x.order) {
                return x.order
            }
            return 100
        })

        return (
            <>
                {propertyGroups.map((item: Group, index: number) => {
                    const isExpanded = index === 0

                    return (
                        <PropertyGroup
                            key={index}
                            title={item.title || ""}
                            extraClassTitle={isExpanded ? "active" : ""}
                            extraClassContents={
                                isExpanded ? "expander-open" : ""
                            }
                            dn={selectedDn}
                            dnKind={dnKind}
                            groupName={item.id}
                            group={item}
                            propertyExpanderHandleClick={
                                this.propertyExpanderHandleClick
                            }
                        />
                    )
                })}
            </>
        )
    }

    renderUserView(): JSX.Element {
        const { selectedDn, selectedObjectProps } = this.state

        if (!selectedDn && !selectedObjectProps) {
            return <div className="message-empty">No object selected.</div>
        }

        return (
            <>
                {selectedDn && this._renderPropertiesNodeDn()}
                {selectedObjectProps && this._renderContent()}
            </>
        )
    }

    componentDidMount() {
        this.subscribeToSharedState(
            ["selected_dn", "selected_object_props"],
            ({ selected_dn, selected_object_props }) => {
                let dnParts: DnUtils.RnInfo[] = []
                if (selected_dn) {
                    dnParts = DnUtils.parseDn(selected_dn)
                }

                let dnKind = ""
                if (dnParts.length > 0) {
                    dnKind = _.last(dnParts).kind
                }

                this.setState({
                    selectedDn: selected_dn,
                    dnParts: dnParts,
                    dnKind: dnKind,
                    selectedObjectProps: selected_object_props,
                })
            }
        )
    }

    render() {
        const { selectedDn, selectedObjectProps } = this.state

        return (
            <div
                id="propertiesComponent"
                className={cx("properties", {
                    empty: !selectedDn && !selectedObjectProps,
                })}
            >
                {this.renderUserView()}
            </div>
        )
    }
}
