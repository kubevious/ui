import React, { Fragment } from "react"
import { prettyKind, getNodeLogoUrl } from "../../utils/ui-utils"
import _ from "the-lodash"
import cx from "classnames"
import { RnInfo } from "@kubevious/helpers/dist/dn-utils"

export const DnPath = ({
    dnParts,
    includeLogo,
    bigLogo,
}: {
    dnParts: RnInfo[]
    includeLogo?: boolean
    bigLogo?: boolean
}): JSX.Element => {
    if (dnParts.length > 0 && dnParts[0].kind === "root") {
        dnParts = dnParts.splice(1)
    }
    const lastPart: RnInfo = _.last(dnParts)

    return (
        <div className="dn-path">
            {includeLogo && lastPart && (
                <img
                    className={cx("dn-logo", { big: bigLogo })}
                    src={getNodeLogoUrl(lastPart.kind)}
                />
            )}
            {dnParts.map((part, index) => {
                const kind: string = prettyKind(part.kind)
                return (
                    <Fragment key={index}>
                        <span className="kind">{kind}</span>
                        <span></span>
                        <span className="name">{part.name}</span>
                        {part !== lastPart && (
                            <span className="separator">&gt</span>
                        )}
                    </Fragment>
                )
            })}
            <div className="clearfix"></div>
        </div>
    )
}
