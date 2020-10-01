import React from 'react'

import './styles.scss'

const NewVersion = ({ info }) => {
    return (
      <div className="p-40">
        <div>
          <h3 className="heading-text">Notifications</h3>
        </div>
        <div className="new-version-info overflow-hide">
          <h3>New Version Available</h3>
          <h3>Version: {info.version}</h3>
          <a href={info.url} target="_blank" className="install-btn">
            Install Now:
          </a>
          <a href={info.url} target="_blank" className="target-link">
            {info.url}
          </a>
          <h3>Features</h3>
          <ul>
            {info.features.map((elem) => (
              <li>{elem}</li>
            ))}
          </ul>
          <h3>Changes</h3>
          <ul>
            {info.changes.map((elem) => (
              <li>{elem}</li>
            ))}
          </ul>
        </div>
      </div>
    )
}

export default NewVersion