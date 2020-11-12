export const getFiltersFromInput = (res) => {
    const newRes = []
    const filtersInput = res.match(/\((.+\):\w+(\S|))/g)

    if (filtersInput && filtersInput[0]) {
        const keyword = res.replace(filtersInput[0], '').trim()
        const filtersArr = filtersInput[0].split(' ')
        filtersArr.forEach((el) => {
            const [filter, value] = el.split(':')
            newRes.push({ filter: filter.slice(1, -1), value })
        })
        keyword && newRes.push({ filter: 'keyword', value: keyword })

        return newRes
    }
    return null
}
