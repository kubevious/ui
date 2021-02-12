import React from 'react'

export const MarkerPreview = ({ shape, color }: { shape: string, color: string}): JSX.Element => {
    return (
        <i className="fa" style={{ color: color }} dangerouslySetInnerHTML={{ __html: `&#x${shape};` }}/>
    )
}
