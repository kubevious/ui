import React from "react"
import { PropertiesValue } from "../helpers"
import "./styles.scss"
import { Config } from "./types"

export const PropertiesCounters = ({ config }: { config: Config }) => {
    return (
        <div className="counters-container">
            {config &&
                config.map((element) => (
                    <div className="counter-block" key={element.title}>
                        <label>{element.title}</label>
                        <div className="counter-value">
                            {PropertiesValue({ ...element })}
                        </div>
                    </div>
                ))}
        </div>
    )
}
