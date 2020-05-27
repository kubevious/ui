import React from 'react'
import { isEmptyArray } from '../../utils/util'

const About = ({ result }) => {
    return(
        <div className="about">
            <table className="table table-striped table-dark">
                <thead>
                <tr>
                    <th>Property</th>
                    <th>Value</th>
                </tr>
                </thead>
                <tbody>
                {!isEmptyArray(result) && Object.entries(result).map(item => (
                    <tr key={item[1]}>
                        <td>{item[0]}</td>
                        <td>{item[1]}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default About
