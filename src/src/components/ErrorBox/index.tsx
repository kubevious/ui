import React, { useState } from "react"
import { faChevronDown, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "./styles.scss"
import { Error } from "./types"

export const ErrorBox = ({
    error,
    closeError,
}: {
    error: Error
    closeError: () => void
}): JSX.Element => {
    const [expanded, setExpanded] = useState<boolean>(false)

    const {
        data: { message, stack },
        status,
    } = error

    return (
        <div className="ErrorBox-container">
            <div className="error">
                <div className="error-text">
                    Error {status || 0}: {message}
                </div>

                <div className="more-text">
                    {expanded && (
                        <FontAwesomeIcon
                            icon={faTimes}
                            onClick={() => closeError()}
                        />
                    )}
                    {!expanded && (
                        <FontAwesomeIcon
                            icon={faChevronDown}
                            onClick={() => setExpanded(true)}
                        />
                    )}
                </div>
            </div>

            {expanded && (
                <div className="full-error-container">
                    {status === 500 && (
                        <div className="msg retry">
                            Please try refreshing the page
                        </div>
                    )}
                    <div className="msg">
                        Error occurred: {message ? message : error.data}
                    </div>
                    {stack && <div className="msg">{stack}</div>}
                </div>
            )}
        </div>
    )
}
