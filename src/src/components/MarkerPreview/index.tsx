import React from 'react'

const MarkerPreview = ({ shape, color }: { shape: string, color: string}): JSX.Element => {
    return (
        <i className="fa" style={{ color: color }} dangerouslySetInnerHTML={{ __html: `&#x${shape};` }}/>
    )
}

export default MarkerPreview
