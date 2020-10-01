import React from 'react'
import _ from 'the-lodash'

import './styles.scss'

const NewVersion = ({ info }) => {
  let version = info.version;
  if (!_.startsWith(version, 'v')) {
    version = 'v' + version;
  }
    return (
      <div className="p-40">
        <div>
          <h3 className="heading-text">Notifications</h3>
        </div>
        <div className="new-version-info overflow-hide">
          <h3>{info.name} ({version}) Available!</h3>
          <a href={info.url} target="_blank" className="install-btn">
            Install Now
          </a>
          <div>
            or visit:
            <a href={info.url} target="_blank" className="target-link">
              {info.url}
            </a>
          </div>
          { info.features && (info.features.length > 0) && <>
            <h3>Features</h3>
            <ul>
              {info.features.map((elem, index) => (
                <li key={index}>{elem}</li>
              ))}
            </ul>
          </>
          }
          { info.changes && (info.changes.length > 0) && <>
            <h3>Changes</h3>
            <ul>
              {info.changes.map((elem, index) => (
                <li key={index}>{elem}</li>
              ))}
            </ul>
          </>
          }
        </div>
      </div>
    )
}

export default NewVersion