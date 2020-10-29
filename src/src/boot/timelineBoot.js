import moment from 'moment'

export function generateTimelineData() {
  const startDate = moment().subtract(14, 'days');
  const endDate = moment().add(5, 'days');
  const duration = moment.duration(endDate.diff(startDate)).asSeconds();
  const results = []
  let currDate = moment(startDate);
  while (moment(currDate).isSameOrBefore(endDate)) {
    const date = moment(currDate);
    const pos = moment.duration(date.diff(startDate)).asSeconds();
    results.push({
      dateMoment: date,
      date: date.toISOString(),
      changes: Math.floor(500 * Math.abs(Math.sin(50 * pos / duration))),
      error: Math.floor(100 * Math.abs(Math.sin(100 * pos / duration))),
      warn: Math.floor(300 * Math.abs(Math.cos(70 * pos / duration))),
    })
    currDate = moment(currDate).add(1, 'minutes')
  }
  return results
}
