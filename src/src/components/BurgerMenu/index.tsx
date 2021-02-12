import React, { useState } from "react"
import "./styles.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faBars,
    faFileDownload,
    faFileExport,
    faFileImport,
} from "@fortawesome/free-solid-svg-icons"
import cx from "classnames"
import { IMarkerService } from "@kubevious/ui-middleware"
import { Markers } from "../../types"

export const BurgerMenu = ({
    type,
    service,
}: {
    type: string
    service: IMarkerService
}): JSX.Element => {
    const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false)
    const [deleteExtra, setDeleteExtra] = useState<boolean>(false)

    const exportItems = (): void => {
        service.backendExportItems((response: Markers) => {
            const dataStr: string =
                "data:text/json;charset=utf-8," +
                encodeURIComponent(JSON.stringify(response))
            const exportElem: HTMLElement | null = document.getElementById(
                "exportAnchor"
            )
            if (exportElem) {
                exportElem.setAttribute("href", dataStr)
                exportElem.setAttribute("download", `${response.kind}.json`)
                exportElem.click()
            }
        })
    }

    const uploadFile = (): void => {
        const input = document.getElementById(
            `upload-${type}`
        ) as HTMLInputElement

        if (input?.files?.length === 0) {
            console.error("No file selected.")
            return
        }

        const reader: FileReader = new FileReader()
        const strData: string = reader.result?.toString() || ""
        reader.onload = () => {
            const importData: {
                data: {}
                deleteExtra: boolean
            } = {
                data: JSON.parse(strData),
                deleteExtra,
            }
            service.backendImportItems(importData, () => {
                input.value = ""
            })
        }

        input.files && reader.readAsText(input.files[0])
    }

    return (
        <div
            className="BurgerMenu-container"
            onMouseEnter={() => setIsMenuVisible(true)}
            onMouseLeave={() => setIsMenuVisible(false)}
        >
            <input
                type="file"
                id={`upload-${type}`}
                name={`upload-${type}`}
                onChange={() => uploadFile()}
            />

            <div className={cx("button-wrapper", { hovered: isMenuVisible })}>
                <FontAwesomeIcon icon={faBars} />
            </div>

            <div className={cx("menu", { hidden: !isMenuVisible })}>
                <a id="exportAnchor" style={{ display: "none" }} />

                <div className="menu-item" onClick={() => exportItems()}>
                    <div className="icon">
                        <FontAwesomeIcon icon={faFileExport} />
                    </div>
                    Export {type}s
                </div>
                <div className="menu-item">
                    <label
                        htmlFor={`upload-${type}`}
                        onClick={() => setDeleteExtra(false)}
                    >
                        <div className="icon">
                            <FontAwesomeIcon icon={faFileImport} />
                        </div>
                        Import {type}s
                    </label>
                </div>
                <div className="menu-item">
                    <label
                        htmlFor={`upload-${type}`}
                        onClick={() => setDeleteExtra(true)}
                    >
                        <div className="icon">
                            <FontAwesomeIcon icon={faFileDownload} />
                        </div>
                        Replace {type}s
                    </label>
                </div>
            </div>
        </div>
    )
}
