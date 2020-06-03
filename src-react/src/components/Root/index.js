import React, { useState } from 'react'
import './styles.css'
import GoldenLayoutComponent from '../GoldenLayout'
import Popup from '../Popup'
import Header from '../Header'

const Root = ({ service, sharedState, diagramSource }) => {
    const [showPopup, setShowPopup] = useState(false)
    const [popupContent, setPopupContent] = useState(null)
    const [layout, setLayout] = useState(null)
    const [windows, setWindows] = useState([])

    const handleShowPopup = () => setShowPopup(true)
    const handleClosePopup = () => setShowPopup(false)
    const handlePopupContent = (content) => setPopupContent(content)

    const handleLayout = (value) => {
        setLayout(value)
        setWindows(value._components
            .filter(item => !item.skipClose)
            .map(component => ({ ...component, isVisible: true })))

        sharedState.subscribe('selected_dn', (selected_dn) => {
            if (selected_dn) {
                value.activateComponent('universeComponent')
            }
        })
    }

    const handleChangeWindow = (e) => {
        const windowId = e.target.getAttribute('tool-window-id');
        const isVisible = document.getElementById(windowId) !== null;

        setWindows(windows.map(component => component.id === windowId ? {
            ...component,
            isVisible: isVisible
        } : component))

        if (isVisible) {
            layout.hideComponent(windowId);
        } else {
            layout.showComponent(windowId);
        }
    }

    return (
        <div className="wrapper">
            <Header
                service={service}
                sharedState={sharedState}
                handleShowPopup={handleShowPopup}
                handlePopupContent={handlePopupContent}
                handleClosePopup={handleClosePopup}
                handleChangeWindow={handleChangeWindow}
                windows={windows}
            />

            <GoldenLayoutComponent
                service={service}
                sharedState={sharedState} 
                diagramSource={diagramSource}
                handleLayout={handleLayout}
                handleShowPopup={handleShowPopup}
                handlePopupContent={handlePopupContent}
                closePopup={handleClosePopup}
            />

            {showPopup && <Popup closePopup={handleClosePopup}>
                {popupContent}
            </Popup>}
        </div>
    )
}

export default Root