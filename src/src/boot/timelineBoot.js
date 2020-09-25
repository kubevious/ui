import moment from 'moment'

export const timelineData = getArray()

function getArray() {
  let stopDate = moment().subtract(14, 'days')
  const today = moment()
  const dateArray = []
  console.log(`TIME MACHINE START DATE = ${stopDate}`)
  while (moment(stopDate).isSameOrBefore(today)) {
    dateArray.push({
      date: moment(stopDate).toISOString(),
      changes: 4 + ~~(Math.random() * 6),
      errors: 5 + ~~(Math.random() * 2),
      warnings: 2 + ~~(Math.random() * 2),
    })
    stopDate = moment(stopDate).add(1, 'minutes')
  }
  console.log(`TIME MACHINE END DATE = ${stopDate}`)
  return dateArray
}
