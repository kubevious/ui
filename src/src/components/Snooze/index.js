import React from 'react'
import { BaseComponent } from '@kubevious/ui-framework'
import $ from 'jquery'
import './styles.scss'

export class Snooze extends BaseComponent<IMiscService> {
    constructor(props) {
        super(props, { kind: 'misc' })

        this.state = {
            isSnoozed: false,
        }

        this.handleSnooze = this.handleSnooze.bind(this)
        this.handleMarkAsRead = this.handleMarkAsRead.bind(this)
    }

    get id() {
        return this.props.id;
    }

    get kind() {
        return this.props.kind;
    }

    handleMarkAsRead(e) {
        this._submit(e, null);
    }

    handleSnooze(e, days) {
        this._submit(e, days);
    }

    _submit(e, days)
    {
        const data = {
            kind: this.kind,
            id: this.id,
            days: days
        }

        this.service.submitSnooze(data, () => {
            
        })
    }

    render() {
        return (
            <div className="snooze-btn">
                { (this.kind == 'message') && <>
                    <button
                        className="button light"
                        onClick={this.handleMarkAsRead}
                    >
                        Mark as read
                    </button>
                </>
                }
                {this.state.isSnoozed ? (
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
