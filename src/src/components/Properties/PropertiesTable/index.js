import React from 'react'
import _ from 'the-lodash'
import cx from 'classnames'
import DnShortcutComponent from '../../DnShortcutComponent'

import './styles.scss'
import DnComponent from '../../DnComponent'

const PropertiesTable = ({ group, options, state, dn }) => {
    const tableData = group.config

    const tableHeaders = () => {
        return tableData.headers.map(x => {
            let column = {};
            if (_.isObject(x)) {
                column.name = x.id
                if (x.label) {
                    column.label = x.label;
                }

                if (x.kind) {
                    column.formatter = x.kind;
                }
            } else {
                column.name = x;
            }
            if (!column.label) {
                column.label = column.name;
            }
            return column;
        })
    }

    const renderRow = (row, column) => {
        let cell = row;
        if (column.name) {
            cell = row[column.name];
        }

        return (
            <td key={column.name}>
                {column.formatter ? renderColumnFormatter(column.formatter, cell) : cell}
            </td>
        )
    }

    const renderColumnFormatter = (formatter, cell) => {
        if (formatter === 'check') return renderRowCheckbox(cell)
        if (formatter === 'shortcut') return <DnShortcutComponent dn={cell} state={state} options={options} />
    }

    const renderRowCheckbox = (value) => (
        <div className={cx('properties-checkbox', { 'checked': value, 'unchecked': !value })}/>
    )

    return (
        <div className="PropertiesTable-wrapper p-40 overflow-hide">
            {dn && <div className="container-header">
                <DnComponent dn={dn} options={options} />
                <h3>Resource Role Matrix</h3>
            </div>}
            <div className="PropertiesTable-container">
                <table className="table table-striped table-dark">
                    <thead>
                        <tr>
                            {tableHeaders().map(item => (
                                <th key={item.name}>{item.label || item.name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tableData && tableData.rows.map((row, index) => (
                            <tr key={index}>
                                {tableHeaders().map(column => renderRow(row, column))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PropertiesTable
