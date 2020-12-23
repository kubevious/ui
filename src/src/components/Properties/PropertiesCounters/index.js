import React from 'react'
import './styles.scss'

const PropertiesCounters = ({ options }) => {
    console.log('properygroup COUNTERS', options);
    return (
    <div className='counters-container'>
            {options.map(element => (
                <div className='counter-block'>
                    <label>{element.title}</label>
                    <div className='counter-value'>
                        <h3>{element.value}</h3>
                        {element.unit && <p>{element.unit}</p>}
                    </div>
            </div>
        ))}
    </div>
    )
}

export default PropertiesCounters
