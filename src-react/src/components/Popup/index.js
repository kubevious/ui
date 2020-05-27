import React from 'react'
import DnComponent from '../DnComponent'

const Popup = ({ header, contents }) => {
    let { title, dn } = header

    return (
        <div id="popup" className="popup">
            <div className="popup-header">
                {dn && <DnComponent dn={dn} />}
                <h3>{title}</h3>
            </div>
            <div className="popup-contents">
                {contents}
            </div>
            <button className="close"/>
        </div>
    )
}

export default Popup
