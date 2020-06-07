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

export const getRandomInt = () => {
    return Math.floor(Math.random(1) * Math.floor(1048576));
}
