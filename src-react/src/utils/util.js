export const isEmptyObject = (obj) => {
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key))
            return false
    }
    return true
}

export const isEmptyArray = (arr) => {
    return !arr || arr.length === 0;
}
