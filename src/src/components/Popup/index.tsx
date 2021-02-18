import React from "react"
import { sharedState } from "../../configureService"

import "./styles.scss"

export const Popup: React.FunctionComponent<any> = ({ popupContent }) => {
    function closePopup() {
        sharedState.set("popup_window", null)
    }

    return (
        <div id="popup" className="popup">
            <div className="popup-contents">{popupContent}</div>
            <button className="close" onClick={closePopup} />
        </div>
    )
}