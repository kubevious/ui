import _ from 'the-lodash'
import React from 'react'

import './styles.scss'

import PropertiesValue from '../helpers'

export const KeyValueList = ({ config }) => {
    return (
        <div className="KeyValueList-container">
            {config &&
                Object.entries(config).map((item, index) => (
                    <div className="env-variable" key={index}>
                        <div className="name">{item[0]}:</div>
                        <div className="value">{PropertiesValue(item[1])}</div>
                    </div>
                ))}
        </div>
    )
}
