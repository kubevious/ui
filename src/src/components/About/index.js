import React from 'react'
import { isEmptyArray } from '../../utils/util'

const About = ({ result }) => {
    return(
        <div className="About-wrapper p-40 overflow-hide">
            <div className="container-header">
                <h3>About Kubevious</h3>
            </div>
            <table className="table table-striped table-dark">
                <thead>
                <tr>
                    <th>Property</th>
                    <th>Value</th>
                </tr>
                </thead>
                <tbody>
                {!isEmptyArray(result) && result.map((item, index) => (
                    <tr key={index}>
                        <td>{(item.category ? item.category + ' :: ' : '' ) + item.name}</td>
                        <td>{item.value}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default About
