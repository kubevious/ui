import _ from "the-lodash"
import React from "react"

import "./styles.scss"
import { PropertiesValue } from "../helpers"
import { Config } from "./types"

export const KeyValueList = ({ config }: { config: Config }) => {
    return (
        <div className="KeyValueList-container">
            {Object.entries(config).map((item, index) => {
                const value =
                    typeof item[1] === "object" ? { ...item[1] } : item[1]
                return (
                    <div className="env-variable" key={index}>
                        <div className="name">{item[0]}:</div>
                        <div className="value">{PropertiesValue(value)}</div>
                    </div>
                )
            })}
        </div>
    )
}
