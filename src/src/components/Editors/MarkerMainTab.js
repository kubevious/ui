import React, { useEffect, useMemo, useState } from 'react'
import { COLORS, SHAPES } from '../../boot/markerData'
import { ChromePicker } from 'react-color'
import cx from 'classnames'
import MarkerPreview from '../MarkerPreview'

const MarkerMainTab = ({ selectedItem, isSuccess, deleteItem, openSummary, createItem, saveItem }) => {
    const [displayColorPicker, setDisplayColorPicker] = useState(false)
    const [formData, setFormData] = useState(selectedItem)

    useEffect(() => {
        setFormData({ ...selectedItem })
    }, [selectedItem])

    const { name, color, shape } = formData

    const validation = useMemo(() => formData.name === '', [formData])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleChangeShape = (name) => {
        setFormData({ ...formData, shape: name })
    }

    const handleChangeColor = (color) => {
        setFormData({ ...formData, color: color })
    }

    return (
        <>
            <div className="field">
                <div className="label-wrapper">
                    <label>Name</label>
                </div>
                <div className="marker-area name-area">
                    <div className="shape">
                        <MarkerPreview shape={shape} color={color} />
                    </div>
                    <input
                        type="text"
                        className="field-input name"
                        value={name || ''}
                        name="name"
                        onChange={(e) => handleChange(e)}
                    />
                </div>
            </div>

            <div className="field">
                <div className="label-wrapper">
                    <label>Shape</label>
                </div>
                <div className="marker-area">
                    {SHAPES.map(item => (
                            <div
                                className={cx('marker-wrapper', { 'selected': item === shape })}
                                key={item}
                                onClick={() => handleChangeShape(item)}
                            >
                                <div key={item}
                                     style={{ color: color }}
                                     className="icon-wrapper"
                                >
                                    <MarkerPreview shape={item} color={color} />
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>

            <div className="field">
                <div className="label-wrapper">
                    <label>Color</label>
                </div>
                <div className="marker-area">
                    {COLORS.map(item => (
                        <div className={cx('marker-wrapper', { 'selected': item === color })}
                             key={item}
                             onClick={() => handleChangeColor(item)}
                        >
                            <div
                                style={{ color: color }}
                                className="icon-wrapper"
                            >
                                <MarkerPreview shape={shape} color={item} />
                            </div>
                        </div>
                    ))}
                </div>

                <button className="custom-color" onClick={() => setDisplayColorPicker(!displayColorPicker)}>Pick
                    Color
                </button>
                {displayColorPicker && <div className="color-popover">
                    <div className="cover" onClick={() => setDisplayColorPicker(false)}/>
                    <ChromePicker onChange={(color, event) => handleChangeColor(color.hex)} color={color}/>
                </div>}
            </div>

            <div className="btn-group">
                {selectedItem.id && <>
                    <button className="button" onClick={() => deleteItem(formData)}>Delete</button>
                    <button className="button" onClick={() => openSummary()}>Cancel</button>
                    <button className="button success" onClick={() => saveItem(formData)} disabled={validation}>Save
                    </button>
                    {isSuccess && <span>Saved!</span>}
                </>}

                {!selectedItem.id && <button className="button success" onClick={() => createItem(formData)}
                                             disabled={validation}>Create</button>}

            </div>
        </>
    )
}


export default MarkerMainTab