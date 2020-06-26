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
                {error.status === 500 && <div className="msg retry">Please try refreshing the page</div>}
                <div className="msg">Error occurred: {error.message ? error.message : error}</div>
                <div className="msg">{error.stack}</div>
            </div>}
        </div>
    )
}

export default ErrorBox
