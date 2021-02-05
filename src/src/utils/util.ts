import { Dn, Messages } from '../types';

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

export const getRandomInt = (): number => {
    return Math.floor(Math.random() * Math.floor(1048576));
}

export const uniqueMessages = (messages: Messages[]): Messages[] => {
    let temp: Messages[] = []

    messages?.map(item => {
        const element = temp.find(tempI => tempI.severity === item.severity && tempI.msg === item.msg)

        if (!element) {
            temp.push(item)
        }
    })

    return temp
}

export const uniqueObjects = (objects: Dn[]): Dn[] => {
    let temp: Dn[] = []

    objects?.map(item => {
        const element = temp.find(tempI => tempI.dn === item.dn)

        if (!element) {
            temp.push(item)
        }
    })

    return temp
}

export const sortSeverity = (a: Messages, b: Messages): number => {
    if (a.severity === 'error' && b.severity === 'warn') {
        return -1
    }

    if (a.severity === 'warn' && b.severity === 'error') {
        return 1
    }

    return 0
}

export const insertToArray = (arr: any[], index: number, item: any) => [
    ...arr.slice(0, index),
    item,
    ...arr.slice(index)
]
