import React, { useEffect, useMemo, useState } from 'react'
import { COLORS, SHAPES } from '../../boot/markerData'
import { ChromePicker } from 'react-color'
import cx from 'classnames'

const MarkerMainTab = ({ selectedItemId, selectedItem, selectedItemData, isSuccess, deleteItem, openSummary, createItem, saveItem }) => {
    const [displayColorPicker, setDisplayColorPicker] = useState(false)
    const [formData, setFormData] = useState({})
    const [formDataId, setFormDataId] = useState(null)

    useEffect(() => {
        if (selectedItemId !== formDataId) {
            setFormDataId(formDataId)
            setFormData({ ...selectedItem })
        }
    }, [selectedItemId, selectedItem])

    const { name, color, shape } = formData

    const validation = useMemo(() => formData.name === '', [formData])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleChangeShape = (shape) => {
        setFormData({ ...formData, shape: shape })
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
                <i class="fa" style={{ color: color }} dangerouslySetInnerHTML={{ __html: "&#x" + shape + ";" }}></i>
                <input
                    type="text"
                    className="field-input name"
                    value={name || ''}
                    name="name"
                    onChange={(e) => handleChange(e)}
                />
            </div>

            <div className="field">
                <div className="label-wrapper">
                    <label>Shape</label>
                </div>
                <div className="marker-area">
                    {SHAPES.map(item => (
                        <div className={cx('marker-wrapper', { 'selected': item === shape })} key={item}>
                            <div key={item} 
                                 style={{ color: color }}
                                 onClick={() => handleChangeShape(item)}
                                 >
                                <i class="fa" style={{ color: color }} dangerouslySetInnerHTML={{ __html: "&#x" + item + ";" }}></i>
                            </div>
                        </div>
                    ))}
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
                             onClick={() => handleChangeColor(item)}>
                            <i class="fa" style={{ color: item }} dangerouslySetInnerHTML={{ __html: "&#x" + shape + ";" }}></i>
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