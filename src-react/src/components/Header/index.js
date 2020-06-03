import React, { useState } from 'react'
import bugImg from '../../assets/header-btns/bug.svg'
import slackImg from '../../assets/header-btns/slack.svg'
import githubImg from '../../assets/header-btns/github.svg'
import About from '../About'
import Search from '../Search'

import './styles.scss'

const Header = ({ service, sharedState, handleShowPopup, handlePopupContent, handleClosePopup, handleChangeWindow, windows }) => {
    const [showSettings, setShowSettings] = useState(false)

    const openAbout = () => {
        handleShowPopup()
        service.fetchAbout(result => {
            handlePopupContent(<About result={result}/>)
        })
    }

    const openSearch = () => {
        handleShowPopup()
        handlePopupContent(<Search service={service} sharedState={sharedState} closePopup={handleClosePopup}/>)
    }

    const renderSettings = () => {
        return (
            <div id="tool-windows-menu" className="settings-menu" onMouseEnter={() => setShowSettings(true)}
                 onMouseLeave={() => setShowSettings(false)}>
                {windows.map(item => (
                    <span className="s-menu-item" key={item.name}>
                        <label className="ccheck" id={`toolWindowShowHideLabel${item.name}Component`}>
                            {item.isVisible ? 'Hide' : 'Show'} {item.name}
                            <input type="checkbox" tool-window-id={item.id} defaultChecked={true}
                                   onChange={(e) => handleChangeWindow(e)}/>
                            <span className="checkmark"/>
                        </label>
                    </span>
                ))}
            </div>
        )
    }

    return (
        <div className="header">
            <div className="logo"/>
            <div id="history-info" className="history-info"/>
            <div className="actions">
                <a href="https://github.com/kubevious/kubevious/issues/new/choose" target="_blank"
                   className="btn btn-bug">
                    <img src={bugImg} alt="bug"/>

                </a>
                <a href="https://kubevious.slack.com" target="_blank" className="btn btn-slack">
                    <img src={slackImg} alt="slack"/>
                </a>
                <a href="https://github.com/kubevious/kubevious" target="_blank" className="btn btn-github">
                    <img src={githubImg} alt="github"/>
                </a>
                <button id="btnHeaderAbout" type="button" className="btn btn-about" onClick={openAbout}/>
                <button id="btnHeaderSearch" type="button" className="btn btn-search" onClick={openSearch}/>
                <button className="btn btn-settings" onMouseEnter={() => setShowSettings(true)}
                        onMouseLeave={() => setShowSettings(false)}/>
                {showSettings && renderSettings()}
            </div>
        </div>
    )
}

export default Header
