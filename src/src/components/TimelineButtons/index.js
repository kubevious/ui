import React, { useState } from 'react'
import './styles.scss'
import cx from 'classnames'
import BaseComponent from '../../HOC/BaseComponent'
import moment from 'moment'



class TimelineButtons extends BaseComponent {
  constructor(props) {
    super(props)

    this.dayInSec = 12 * 60 * 60

    this.state = {
      time_machine_enabled: false
    }

    this._toggle = this._toggle.bind(this)
    this._reset = this._reset.bind(this)
  }

  _toggle() {
    if (this.state.time_machine_enabled) {
      this.sharedState.set('time_machine_enabled', false)
    } else {
      this.sharedState.set('time_machine_enabled', true)

      if (!this.sharedState.get('time_machine_target_date'))
      {
        let dateTo = this.sharedState.get('time_machine_date_to');
        if (dateTo) {
          this.sharedState.set('time_machine_target_date', dateTo);
        } else {
          this.sharedState.set('time_machine_target_date', moment().toISOString());
        }
      }
    }
  }

  _reset()
  {
    this.sharedState.set('time_machine_enabled', false)
    this.sharedState.set('time_machine_date_to', null)
    this.sharedState.set('time_machine_duration', this.dayInSec)
    this.sharedState.set('time_machine_target_date', null)
  }

  componentDidMount() {

    this.subscribeToSharedState(
      'time_machine_enabled',
      (time_machine_enabled) => {

        this.setState({
          time_machine_enabled: time_machine_enabled
        })

      }
    )

  }

  render() {
    return (
      <div className="tl-actions">
        <a
          role="button"
          id="btnTimelineTimeMachine"
          className={cx('timemachine', {'active': this.state.time_machine_enabled})}
          onClick={() => this._toggle()}
        >
          <span className="tooltiptext">Activate Time Machine</span>
        </a>
        <a
          role="button"
          id="btnTimelineTimeMachine"
          className={`reset`}
          onClick={() => this._reset()}
        >
          <span className="tooltiptext">Reset changes</span>
        </a>
      </div>
    )
  }
}

export default TimelineButtons
