import React from 'react'

import './styles.scss'

const Popup = ({ children, closePopup }) => {
    return (
        <div id="popup" className="popup">
            <div className="popup-contents">
                {children}
            </div>
            <button className="close" onClick={closePopup}/>
        </div>
    )
}

export default Popup
