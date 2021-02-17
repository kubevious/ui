import _ from "the-lodash"
import React from "react"
import bugImg from "../../assets/header-btns/bug.svg"
import slackImg from "../../assets/header-btns/slack.svg"
import githubImg from "../../assets/header-btns/github.svg"
import { About } from "../About"
import { Search } from "../Search"
import { Notifications } from "../Notifications"
import { ClassComponent } from "@kubevious/ui-framework"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import moment from "moment"

import "./styles.scss"
import { IMiscService } from "@kubevious/ui-middleware"
import { Component } from "../GoldenLayout/types"

type HeaderState = {
    showSettings: boolean
    isLoading: boolean
    hasNotifications: boolean
    time_machine_enabled: boolean
    time_machine_target_date: Date | null
}

type HeaderProps = {
    handleChangeWindow: (e: React.ChangeEvent<HTMLInputElement>) => void
    windows:  Component[]
}

export class Header extends ClassComponent<HeaderProps, HeaderState, IMiscService> {
    constructor(props) {
        super(props, { kind: "misc" })

        this.state = {
            showSettings: false,
            isLoading: false,
            hasNotifications: false,
            time_machine_enabled: false,
            time_machine_target_date: null,
        }

        this.openAbout = this.openAbout.bind(this)
        this.openSearch = this.openSearch.bind(this)
        this.detectIsVisible = this.detectIsVisible.bind(this)
        this.renderSettings = this.renderSettings.bind(this)
        this.openNotifications = this.openNotifications.bind(this)
        this.deactivateTimemachine = this.deactivateTimemachine.bind(this)
    }

    openAbout(): void {
        this.sharedState.set("popup_window", {
            title: "About",
        })

        this.service.fetchAbout((result) => {
            this.sharedState.set("popup_window", {
                title: "About",
                content: <About result={result} />,
            })
        })
    }

    openSearch(): void {
        this.sharedState.set("popup_window", {
            title: "Search",
            content: <Search />,
        })
    }

    detectIsVisible(item): boolean {
        return document.getElementById(item.id) !== null
    }

    openNotifications() {
        this.sharedState.set("popup_window", {
            title: "Notifications",
            content: <Notifications />,
        })
    }

    deactivateTimemachine() {
        this.sharedState.set("time_machine_enabled", false)
    }

    renderSettings() {
        const { windows } = this.props

        return (
            <div
                id="tool-windows-menu"
                className="settings-menu"
                onMouseEnter={() => this.setState({ showSettings: true })}
                onMouseLeave={() => this.setState({ showSettings: false })}
            >
                {windows.map((
                    item
                ) => (
                    <span className="s-menu-item" key={item.name}>
                        <label
                            className="ccheck"
                            id={`toolWindowShowHideLabel${item.name}Component`}
                        >
                            {this.detectIsVisible(item) ? "Hide" : "Show"}{" "}
                            {item.name}
                            <input
                                type="checkbox"
                                tool-window-id={item.id}
                                defaultChecked={this.detectIsVisible(item)}
                                onChange={(e) =>
                                    this.props.handleChangeWindow &&
                                    this.props.handleChangeWindow(e)
                                }
                            />
                            <span className="checkmark" />
                        </label>
                    </span>
                ))}
            </div>
        )
    }

    componentDidMount() {
        this.subscribeToSharedState("is_loading", (is_loading) => {
            this.setState({ isLoading: is_loading })
        })

        this.subscribeToSharedState(
            ["time_machine_enabled", "time_machine_target_date"],
            ({
                time_machine_enabled,
                time_machine_target_date,
            }: {
                time_machine_enabled: boolean
                time_machine_target_date: Date
            }) => {
                if (time_machine_enabled && time_machine_target_date) {
                    this.setState({
                        time_machine_enabled,
                        time_machine_target_date,
                    })
                } else {
                    this.setState({
                        time_machine_enabled: false,
                        time_machine_target_date: null,
                    })
                }
            }
        )

        this.subscribeToSharedState("notifications_info", (info) => {
            const hasNotifications =
                info && _.isNotNullOrUndefined(info.count) && info.count > 0
            this.setState({ hasNotifications: hasNotifications })
        })
    }

    render() {
        const {
            showSettings,
            hasNotifications,
            isLoading,
            time_machine_enabled,
            time_machine_target_date,
        } = this.state as HeaderState

        return (
            <div className="header">
                <a className="logo" href="/" />
                <div className="loading-icon">
                    {isLoading && <FontAwesomeIcon icon={faSpinner} spin />}
                </div>
                {time_machine_enabled && (
                    <div id="history-info" className="history-info">
                        <span>
                            Time Machine Active:{" "}
                            {moment(time_machine_target_date).format(
                                "MMM DD hh:mm:ss A"
                            )}
                        </span>
                        <button
                            className="button success deactivate"
                            onClick={this.deactivateTimemachine}
                        >
                            Deactivate
                        </button>
                    </div>
                )}
                <div className="actions">
                    {hasNotifications && (
                        <div className="btn-container">
                            <button
                                id="btnNotifications"
                                type="button"
                                className="btn btn-notifications"
                                onClick={this.openNotifications}
                            ></button>
                            <span className="tooltiptext">Notifications</span>
                        </div>
                    )}

                    <div className="btn-container">
                        <button
                            id="btnHeaderSearch"
                            type="button"
                            className="btn btn-search"
                            onClick={this.openSearch}
                        />
                        <span className="tooltiptext">Object Search</span>
                    </div>

                    <div className="btn-container">
                        <button
                            className="btn btn-settings"
                            onMouseEnter={() =>
                                this.setState({ showSettings: true })
                            }
                            onMouseLeave={() =>
                                this.setState({ showSettings: false })
                            }
                        />
                        {showSettings && this.renderSettings()}
                    </div>

                    <div className="btn-container">
                        <button
                            id="btnHeaderAbout"
                            type="button"
                            className="btn btn-about"
                            onClick={this.openAbout}
                        ></button>
                        <span className="tooltiptext">About Kubevious</span>
                    </div>

                    <div className="btn-container">
                        <a
                            href="https://github.com/kubevious/kubevious/issues/new/choose"
                            target="_blank"
                            className="btn btn-bug"
                        >
                            <img src={bugImg} alt="bug" />
                        </a>
                        <span className="tooltiptext">Report Issues</span>
                    </div>

                    <div className="btn-container">
                        <a
                            href="https://github.com/kubevious/kubevious"
                            target="_blank"
                            className="btn btn-github"
                        >
                            <img src={githubImg} alt="github" />
                        </a>
                        <span className="tooltiptext">GitHub Project</span>
                    </div>

                    <div className="btn-container">
                        <a
                            href="https://kubevious.io/slack"
                            target="_blank"
                            className="btn btn-slack"
                        >
                            <img src={slackImg} alt="slack" />
                        </a>
                        <span className="tooltiptext">Slack Channel</span>
                    </div>
                </div>
            </div>
        )
    }
}
