import React from 'react'
import { isEmptyArray } from '../../../utils/util'
import { formatDate } from '../../../utils/ui-utils'

const AlertTable = ({ alerts }) => {
    return (
        <table className="table table-striped table-dark">
            <thead>
                <tr>
                    <th/>
                    <th>Date</th>
                    <th>Message</th>
                </tr>
            </thead>
            <tbody>
                {!isEmptyArray(alerts) && alerts.map(alert => (
                    <tr key={alert.id}>
                        <td>
                            <div className={"alert-item " + alert.severity} />
                        </td>
                        <td>{formatDate(alert.date)}</td>
                        <td>{alert.msg}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default AlertTable
