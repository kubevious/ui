import React from "react"
import cx from "classnames"

import "./styles.scss"

import { Column, Config, Row, Header } from "./types"
import { DnOptions } from "../../../types"
import { DnShortcutComponent } from "../../DnShortcutComponent"
import { PropertiesValue } from "../helpers"

export const PropertiesTable = ({
    config,
    options,
}: {
    config: Config
    options?: DnOptions
}) => {
    const tableHeaders = (): Column[] => {
        return config.headers.map((x: Header | string) => {
            let column: Column = {}
            if (typeof x !== 'string') {
                column.name = x.id
                if (x.label) {
                    column.label = x.label
                }

                if (x.kind) {
                    column.formatter = x.kind
                }
            } else {
                column.name = x
            }
            if (!column.label) {
                column.label = column.name
            }
            return column
        })
    }

    const renderRow = (row: Row | string, column: Column): JSX.Element => {
        const cell: string = column.name
            ? row[column.name]
            : typeof row === "string"
            ? row
            : ""

        return (
            <td key={column.name}>
                {column.formatter
                    ? renderColumnFormatter(column.formatter, cell)
                    : PropertiesValue(cell)}
            </td>
        )
    }

    const renderColumnFormatter = (formatter: string, cell: string): JSX.Element | undefined => {
        if (formatter === "check") return renderRowCheckbox(cell)
        if (formatter === "shortcut")
            return <DnShortcutComponent dn={cell} options={options} />
    }

    const renderRowCheckbox = (value) => (
        <div
            className={cx("properties-checkbox", {
                checked: value,
                unchecked: !value,
            })}
        />
    )

    return (
        <div className="PropertiesTable-container">
            <table className="table table-striped table-dark">
                <thead>
                    <tr>
                        {tableHeaders().map((item) => (
                            <th key={item.name}>{item.label || item.name}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {config &&
                        config.rows.map((row, index) => (
                            <tr key={index}>
                                {tableHeaders().map((column) =>
                                    renderRow(row, column)
                                )}
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )
}
