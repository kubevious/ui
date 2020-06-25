import React, { useState } from 'react';
import { faChevronDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './styles.scss'

const ErrorBox = ({ error, closeError }) => {
    const [expanded, setExpanded] = useState(false)

    return (
        <div className="ErrorBox-container">
            <div className="error">
                <div className="error-text">
                    Error {error.status}: {error.message}
                </div>

                <div className="more-text">
                    {expanded && <FontAwesomeIcon icon={faTimes} onClick={() => closeError()}/>}
                    {!expanded && <FontAwesomeIcon icon={faChevronDown} onClick={() => setExpanded(true)}/>}
                </div>
            </div>

            {expanded && <div className="full-error-container">
                <div className="msg">Error occurred: {error.message}</div>
                <div className="msg">{error.stack}</div>
            </div>}
        </div>
    )
}

export default ErrorBox
