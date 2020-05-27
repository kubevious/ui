import React from 'react'
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

const Root = () => {
    const state = new SharedState()

    const rootService = process.env.REACT_APP_MOCKED_DATA ? new MockRootApiService(state) : new RootApiService(state);
    const service = rootService.kubevious();

    const stateHandler = new StateHandler(state, service);

    const openAbout = () => {
        service.fetchAbout((result) => {
            popupOpen(<About result={result}/>, {
                header: {
                    title: 'About Kubevious'
                }
            })

        })
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
                    <button id="btnHeaderSearch" type="button" className="btn btn-search"/>
                    <button className="btn btn-settings">
                        <span id="tool-windows-menu" className="settings-menu">
                        </span>
                    </button>
                </div>
            </div>

            <GoldenLayoutComponent service={service} state={state}/>
        </div>
    )
}

export default Root