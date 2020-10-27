import moment from 'moment'

export const timelineData = getArray()

function getArray() {
  let stopDate = moment().subtract(14, 'days')
  const today = moment().add(1, 'days')
  const dateArray = []
  while (moment(stopDate).isSameOrBefore(today)) {
    const date = moment(stopDate);
    dateArray.push({
      dateMoment: date,
      date: date.toISOString(),
      changes: 4 + ~~(Math.random() * 6),
      error: 5 + ~~(Math.random() * 2),
      warn: 2 + ~~(Math.random() * 2),
    })
    stopDate = moment(stopDate).add(1, 'minutes')
  }
  return dateArray
}
