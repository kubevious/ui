import React, { Fragment } from "react"
import _ from "the-lodash"
import { getNodeLogoUrl, prettyKind } from "../../utils/ui-utils"

import * as DnUtils from "@kubevious/helpers/dist/dn-utils"

import "./styles.scss"
import { DnOptions } from "../../types"

type DnComponentProps = {
    dn: string
    options?: DnOptions
}

export const DnComponent: React.FunctionComponent<DnComponentProps> = ({
    dn,
    options,
}) => {
    const opt = options || {}

    let dnParts = DnUtils.parseDn(dn)
    const lastPart = _.last(dnParts)

    if (opt.relativeTo) {
        const parentDnParts = DnUtils.parseDn(opt.relativeTo)
        while (
            dnParts.length > 0 &&
            parentDnParts.length > 0 &&
            dnParts[0].rn === parentDnParts[0].rn
        ) {
            dnParts.shift()
            parentDnParts.shift()
        }
    }

    if (dnParts.length > 0 && dnParts[0].kind === "root") {
        dnParts = dnParts.splice(1)
    }
    const url = lastPart ? lastPart.kind : ""
    return (
        <div className="dn-path">
            <img className="dn-logo" src={getNodeLogoUrl(url)} alt="logo" />
            {dnParts.map((item, index) => (
                <Fragment key={index}>
                    <span className="kind">{prettyKind(item.kind)}</span>
                    <span className="name">{item.name}</span>
                    {index !== dnParts.length - 1 && (
                        <span className="separator">&gt;</span>
                    )}
                    {index === dnParts.length - 1 && (
                        <div className="clearfix" />
                    )}
                </Fragment>
            ))}
        </div>
    )
}
