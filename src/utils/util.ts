export const isEmptyObject = (obj: {}): boolean => {
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key))
            return false
    }
    return true
}

export const isEmptyArray = (arr: any[]): boolean => { // Later will be corrected on other type
    return !arr || arr.length === 0;
}
