import React  from 'react'
import bugImg from '../../assets/header-btns/bug.svg'
import slackImg from '../../assets/header-btns/slack.svg'
import githubImg from '../../assets/header-btns/github.svg'
import About from '../About'
import Search from '../Search'
import NewVersion from '../NewVersion';
import BaseComponent from '../../HOC/BaseComponent'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment'
import Feedback from '../Feedback'

import './styles.scss'

class Header extends BaseComponent {
    constructor(props) {
        super(props);

        this.registerService({ kind: 'misc' })

        this.state = {
            showSettings: false,
            isLoading: false,
            newVersion: false,
        }

        this.openAbout = this.openAbout.bind(this)
        this.openSearch = this.openSearch.bind(this)
        this.detectIsVisible = this.detectIsVisible.bind(this)
        this.renderSettings = this.renderSettings.bind(this)
        this.openNewVersionInfo = this.openNewVersionInfo.bind(this)
        this.deactivateTimemachine = this.deactivateTimemachine.bind(this)
    }

    openAbout() {
        this.props.handleShowPopup()
        this.service.fetchAbout(result => {
            this.props.handlePopupContent(<About result={result}/>)
        })
    }

    openSearch() {
        this.props.handleShowPopup()
        this.props.handlePopupContent(<Search closePopup={this.props.handleClosePopup}/>)
    }

    detectIsVisible(item) {
        return document.getElementById(item.id) !== null;
    }

    openNewVersionInfo() {
        this.props.handleShowPopup()

        this.service.fetchNewVersion(result => {
            this.props.handlePopupContent(<NewVersion info={result}/>)
        })
    }

    deactivateTimemachine() {
        this.sharedState.set('time_machine_enabled', false)
    }

    renderSettings() {
        const { windows } = this.props

        return (
            <div id="tool-windows-menu" className="settings-menu"
                 onMouseEnter={() => this.setState({ showSettings: true })}
                 onMouseLeave={() => this.setState({ showSettings: false })}>
                {windows.map(item => (
                    <span className="s-menu-item" key={item.name}>
                        <label className="ccheck" id={`toolWindowShowHideLabel${item.name}Component`}>
                            {this.detectIsVisible(item) ? 'Hide' : 'Show'} {item.name}
                            <input type="checkbox" tool-window-id={item.id} defaultChecked={this.detectIsVisible(item)}
                                   onChange={(e) => this.props.handleChangeWindow(e)}/>
                            <span className="checkmark"/>
                        </label>
                    </span>
                ))}
            </div>
        )
    }

    componentDidMount() {
        this.subscribeToSharedState('is_loading',
            (is_loading) => {
                this.setState({ isLoading: is_loading })
            })

        this.subscribeToSharedState(
            [
                'time_machine_enabled',
                'time_machine_target_date'
            ],
            ({
                time_machine_enabled,
                time_machine_target_date
            }) => {
                if (time_machine_enabled && time_machine_target_date) {
                    this.setState({
                        time_machine_enabled,
                        time_machine_target_date
                    });
                } else {
                    this.setState({
                        time_machine_enabled: false,
                        time_machine_target_date: null
                    });
                }
            }
            );
        this.subscribeToSharedState('new_version_info', (info) => {
            this.setState({ newVersion: info.newVersionPresent })
        })
    }

    render() {
        const { showSettings, isLoading } = this.state
        const { time_machine_enabled, time_machine_target_date } = this.state

        return (
            <div className="header">
                <div className="logo"/>
                <div className="loading-icon">
                    {isLoading && <FontAwesomeIcon icon={faSpinner} spin />}
                </div>
                { time_machine_enabled &&
                    <div id="history-info" className="history-info">
                        <span>Time Machine Active: {moment(time_machine_target_date).format('MMM DD hh:mm:ss A')}</span>
                        <button className="button success deactivate" onClick={this.deactivateTimemachine}>Deactivate</button>
                    </div>
                }
                <div className="actions">

                    {this.state.newVersion &&
                        <div className="btn-container">
                            <button id="btnHeaderNewVersion" type="button" className="btn btn-new-version" onClick={this.openNewVersionInfo}></button>
                            <span className="tooltiptext">Notifications</span>
                        </div>}


                    <div className="btn-container">
                        <button id="btnHeaderSearch" type="button" className="btn btn-search" onClick={this.openSearch} />
                        <span className="tooltiptext">Object Search</span>
                    </div>

                    <div className="btn-container">
                        <button className="btn btn-settings" onMouseEnter={() => this.setState({ showSettings: true })}
                            onMouseLeave={() => this.setState({ showSettings: false })} />
                        {showSettings && this.renderSettings()}
                    </div>

                    <div className="btn-container">
                        <button id="btnHeaderAbout" type="button" className="btn btn-about" onClick={this.openAbout}>
                        </button>
                        <span className="tooltiptext">About Kubevious</span>
                    </div>

                    <div className="btn-container">
                        <a href="https://github.com/kubevious/kubevious/issues/new/choose" target="_blank"
                            className="btn btn-bug">
                            <img src={bugImg} alt="bug" />
                        </a>
                        <span className="tooltiptext">Report Issues</span>
                    </div>

                    <div className="btn-container">
                        <a href="https://github.com/kubevious/kubevious" target="_blank" className="btn btn-github">
                            <img src={githubImg} alt="github" />
                        </a>
                        <span className="tooltiptext">GitHub Project</span>
                    </div>

                    <div className="btn-container">
                        <a href="https://kubevious.io/slack" target="_blank" className="btn btn-slack">
                            <img src={slackImg} alt="slack" />
                        </a>
                        <span className="tooltiptext">Slack Channel</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default Header
