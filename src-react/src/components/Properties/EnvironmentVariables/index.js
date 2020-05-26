import React from 'react'

import './styles.scss'

const EnvironmentVariables = ({ group, options }) => {
    return (
        <div className="EnvironmentVariables-container">
            {group && Object.entries(group.config).map((item, index) => (
                <div className="env-variable" key={index}>
                    <div className="name">
                        {item[0]}:
                        <div className="value" dangerouslySetInnerHTML={{ __html: item[1] }}/>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default EnvironmentVariables
