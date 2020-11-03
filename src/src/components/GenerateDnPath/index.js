import React from 'react'
import { prettyKind, getNodeLogoUrl } from '../../utils/ui-utils'
import _ from 'the-lodash'
import cx from 'classnames'

const DnPath = ({ dnParts, includeLogo, bigLogo }) => {
  if (dnParts.length > 0) {
    if (dnParts[0].kind === 'root') {
      dnParts = dnParts.splice(1)
    }
  }
  const lastPart = _.last(dnParts)

  return (
    <div className="dn-path">
      {includeLogo && lastPart && (
        <img
          className={cx('dn-logo', { big: bigLogo })}
          src={getNodeLogoUrl(lastPart.kind)}
        />
      )}
      {dnParts.map((part) => {
        const kind = prettyKind(part.kind)
        return (
          <>
            <span className="kind">{kind}</span>
            <span></span>
            <span className="name">{part.name}</span>
            {part !== lastPart && <span className="separator">&gt</span>}
          </>
        )
      })}
      <div className="clearfix"></div>
    </div>
  )
}

export default DnPath
