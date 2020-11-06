import React from 'react'
import BaseComponent from '../../HOC/BaseComponent'
import $ from 'jquery'
import './styles.scss'

class Snooze extends BaseComponent {
    constructor(props) {
        super(props)

        this.registerService({ kind: 'misc' })

        this.state = {
            isSnoozed: false,
        }

        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(e) {
        const id = this.props.id
        const delay = e.target.name
        const container = $(e.target).parents()[2]
        this.service.submitSnooze({ id, delay }, () => {
            if ($(container).siblings().length === 0) {
                $('.close').trigger('click')
            }
            $(container).detach()
        })
    }

    render() {
        return (
            <div className="snooze-btn">
                {this.state.isSnoozed ? (
                    <>
                        <button
                            name="tomorrow"
                            className="button light left-btn"
                            onClick={this.handleSubmit}
                        >
                            Tomorrow
                        </button>
                        <button
                            name="week"
                            className="button light right-btn"
                            onClick={this.handleSubmit}
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

export default Snooze
