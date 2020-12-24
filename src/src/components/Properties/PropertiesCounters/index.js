import React from 'react'
import './styles.scss'

import PropertiesValue from '../helpers'

const PropertiesCounters = ({ options }) => {
    return (
        <div className="counters-container">
            {options.map(element => (
                <div className="counter-block">
                    <label>{element.title}</label>
                    <div className="counter-value">
                        {PropertiesValue(element)}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default PropertiesCounters
