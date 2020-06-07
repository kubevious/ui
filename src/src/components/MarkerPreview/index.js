import React from 'react'

const MarkerPreview = ({ shape, color }) => {
    return (
        <i className="fa" style={{ color: color }} dangerouslySetInnerHTML={{ __html: `&#x${shape};` }}/>
    )
}

export default MarkerPreview
