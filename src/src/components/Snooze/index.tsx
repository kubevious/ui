import React from "react"
import { ClassComponent } from "@kubevious/ui-framework"
import "./styles.scss"
import { IMiscService } from "@kubevious/ui-middleware"
import { SnoozeProps, SnoozeState } from "./types"

export class Snooze extends ClassComponent<SnoozeProps, SnoozeState, IMiscService> {
    constructor(props) {
        super(props, null, { kind: "misc" })

        this.state = {
            isSnoozed: false,
        }

        this.handleSnooze = this.handleSnooze.bind(this)
        this.handleMarkAsRead = this.handleMarkAsRead.bind(this)
    }

    get id(): string | undefined {
        return this.props.id
    }

    get kind(): string | undefined {
        return this.props.kind
    }

    handleMarkAsRead(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        this._submit(e, null)
    }

    handleSnooze(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, days: number): void {
        this._submit(e, days)
    }

    _submit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, days: number | null) {
        const data = {
            kind: this.kind,
            id: this.id,
            days: days,
        }

        this.service.submitSnooze(data, () => {})
    }

    render() {
        const { isSnoozed } = this.state
        return (
            <div className="snooze-btn">
                {this.kind == "message" && (
                    <>
                        <button
                            className="button light"
                            onClick={this.handleMarkAsRead}
                        >
                            Mark as read
                        </button>
                    </>
                )}
                {isSnoozed ? (
                    <>
                        <button
                            name="tomorrow"
                            className="button light left-btn"
                            onClick={(e) => this.handleSnooze(e, 1)}
                        >
                            Tomorrow
                        </button>
                        <button
                            name="week"
                            className="button light right-btn"
                            onClick={(e) => this.handleSnooze(e, 7)}
                        >
                            In a week
                        </button>
                    </>
                ) : (
                    <button
                        className="button light"
                        onClick={() => this.setState({ isSnoozed: true })}
                    >
                        Remind later
                    </button>
                )}
            </div>
        )
    }
}
