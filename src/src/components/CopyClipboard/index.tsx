import React, { useState } from "react"
import { faClone as farClone } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import "./styles.scss"

export const CopyClipboard = ({ text }: { text: string }): JSX.Element => {
    const [copied, setCopied] = useState<boolean>(false)

    const copyText = (): void => {
        const textField: HTMLTextAreaElement = document.createElement(
            "textarea"
        )
        textField.value = text
        document.body.appendChild(textField)
        textField.select()
        document.execCommand("copy")
        setCopied(true)
        textField.remove()

        setTimeout(() => {
            setCopied(false)
        }, 3000)
    }

    return (
        <div className="icon-wrapper">
            {copied && (
                <div className="copied-container">
                    Copied to clipboard
                    <div className="caret" />
                </div>
            )}

            <FontAwesomeIcon
                className="copy-icon"
                icon={farClone}
                onClick={() => copyText()}
                title="Copy to clipboard"
            />
        </div>
    )
}
