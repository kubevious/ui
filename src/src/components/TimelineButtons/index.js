import React, { useState } from 'react'
import './styles.scss'
import cx from 'classnames'


const TimelineButtons = ({ toggleTimeMachine, reset, btnHandling }) => {
  const [isTimeMachineActive, setStatus] = useState(false)
  btnHandling(setStatus)

  return (
    <div className="tl-actions">
      <a
        role="button"
        id="btnTimelineTimeMachine"
        className={cx('timemachine', {'active': isTimeMachineActive})}
        onClick={() => toggleTimeMachine()}
      >
        <span className="tooltiptext">Activate Time Machine</span>
      </a>
      <a
        role="button"
        id="btnTimelineTimeMachine"
        className={`reset`}
        onClick={() => reset()}
      >
        <span className="tooltiptext">Reset changes</span>
      </a>
    </div>
  )
}

export default TimelineButtons
