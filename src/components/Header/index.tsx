import React from "react"
import _ from "the-lodash"
// import { Notifications } from "../Notifications"
import { ClassComponent } from "@kubevious/ui-framework"
import { FontAwesomeIcon, FASolidIcons } from "@kubevious/ui-components"

import "./styles.scss"
import { GoldenLayoutWindowInfo } from "@kubevious/ui-components"
import { HeaderProps, HeaderState } from "./types"

export class Header extends ClassComponent<HeaderProps, HeaderState, any> {
    constructor(props : HeaderProps | Readonly<HeaderProps>) {
        super(props, null, { kind: "misc" })

        this.state = {
            showSettings: false,
            isLoading: false,
            hasNotifications: false,
            visible_windows: {}
        }

        this.detectIsVisible = this.detectIsVisible.bind(this)
        this.renderSettings = this.renderSettings.bind(this)
        this.openNotifications = this.openNotifications.bind(this)
        this.deactivateTimemachine = this.deactivateTimemachine.bind(this)
        this.handleWindowVisibilityChange = this.handleWindowVisibilityChange.bind(this)
    }

    detectIsVisible(item: GoldenLayoutWindowInfo): boolean {
        if (this.state.visible_windows[item.id]) {
            return true;
        }
        return false;
    }

    openNotifications(): void {
        // this.sharedState.set("popup_window", {
        //     title: "Notifications",
        //     content: <Notifications />,
        // })
    }

    deactivateTimemachine(): void {
        this.sharedState.set("time_machine_enabled", false)
    }

    handleWindowVisibilityChange(windowInfo: GoldenLayoutWindowInfo) {
        const visible_windows = this.sharedState.get<Record<string, boolean>>("visible_windows", {});
        if (this.detectIsVisible(windowInfo)) {
            delete visible_windows[windowInfo.id];
        } else {
            visible_windows[windowInfo.id] = true;
        }
        this.sharedState.set("visible_windows", visible_windows);
    }

    renderSettings(): JSX.Element {
        const { windows } = this.props

        const closableWindows = windows.filter(x => !x.skipClose);

        return (
            <div
                id="tool-windows-menu"
                className="settings-menu"
                onMouseEnter={() => this.setState({ showSettings: true })}
                onMouseLeave={() => this.setState({ showSettings: false })}
            >
                {closableWindows.map((
                    item
                ) => (
                    <span className="s-menu-item" key={item.id}>
                        <label
                            className="ccheck"
                            id={`toolWindowShowHideLabel${item.id}`}
                        >
                            {this.detectIsVisible(item) ? "Hide" : "Show"}{" "}
                            {item.title}
                            <input
                                type="checkbox"
                                tool-window-id={item.id}
                                defaultChecked={this.detectIsVisible(item)}
                                onChange={(e) =>
                                    this.handleWindowVisibilityChange(item)
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

        this.subscribeToSharedState("visible_windows", (visible_windows) => {
            this.setState({
                visible_windows: visible_windows
            })
        });

        this.subscribeToSharedState("is_loading", (is_loading) => {
            this.setState({ isLoading: is_loading })
        })

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
        } = this.state

        return (
            <div className="header">
                <a className="logo" href="/" />
                <div className="loading-icon">
                    {isLoading && <FontAwesomeIcon icon={FASolidIcons.faSpinner} spin />}
                </div>
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
                </div>
            </div>
        )
    }
}
