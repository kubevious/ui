import React, { useState } from 'react'
import bugImg from '../../assets/header-btns/bug.svg'
import slackImg from '../../assets/header-btns/slack.svg'
import githubImg from '../../assets/header-btns/github.svg'
import './styles.css'
import GoldenLayoutComponent from '../GoldenLayout'
import RootApiService from '../../services/RootApiService'
import SharedState from '../../state/shared-state'
import StateHandler from '../../state/state-handler'
import MockRootApiService from '../../services-mock/MockRootApiService'
import { popupOpen } from '../../utils/ui-utils'
import About from '../About'
import Search from '../Search'

const Root = () => {
    const [showSearch, setShowSearch] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const [layout, setLayout] = useState(null)
    const [windows, setWindows] = useState([])

    const state = new SharedState()

    const rootService = process.env.REACT_APP_MOCKED_DATA ? new MockRootApiService(state) : new RootApiService(state);
    const service = rootService.kubevious();

    const stateHandler = new StateHandler(state, rootService);

    const handleLayout = (value) => {
        setLayout(value)
        setWindows(value._components
            .filter(item => !item.skipClose)
            .map(component => ({ ...component, isVisible: true })))
    }

    const openAbout = () => {
        service.fetchAbout((result) => {
            popupOpen(<About result={result}/>, {
                header: {
                    title: 'About Kubevious'
                }
            })

        })
    }

    const openSearch = () => setShowSearch(!showSearch)

    const hideSearch = () => setShowSearch(false)

    const handleChangeWindow = (e) => {
        const windowId = e.target.getAttribute('tool-window-id');
        const isVisible = e.target.checked;

        setWindows(windows.map(component => component.id === windowId ? {
            ...component,
            isVisible: isVisible
        } : component))

        if (!isVisible) {
            layout.hideComponent(windowId);
        } else {
            layout.showComponent(windowId);
        }
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
        <div className="wrapper">
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

            <GoldenLayoutComponent service={service} state={state} handleLayout={handleLayout}/>

            {showSearch && <Search service={service} hideSearch={hideSearch} state={state}/>}
        </div>
    )
}

export default Root