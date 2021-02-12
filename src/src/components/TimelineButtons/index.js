import React from 'react'
import './styles.scss'
import cx from 'classnames'
import { BaseComponent } from '@kubevious/ui-framework'
import moment from 'moment'
import TimelineUtils from '../../utils/timeline-utils'



class TimelineButtons extends BaseComponent {
  constructor(props) {
    super(props)

    this._timelineUtils = new TimelineUtils(this.sharedState)

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

      let actual = this._timelineUtils.getActualRange();

      if (this.sharedState.get('time_machine_target_date'))
      {
        const date = moment(this.sharedState.get('time_machine_target_date'))
        if (date.isBetween(actual.from, actual.to)) {
          return;
        }
      }

      const diff = actual.to.diff(actual.from) / 2;
      const date = moment(actual.from).add(diff);
      this.sharedState.set('time_machine_target_date', date.toISOString());
    }
  }

  _reset()
  {
    const initDuration = this._timelineUtils.getActualInitDuration()

    this.sharedState.set('time_machine_enabled', false)
    this.sharedState.set('time_machine_date_to', null)
    this.sharedState.set('time_machine_duration', initDuration)
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
      <div className="tl-interaction">
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
