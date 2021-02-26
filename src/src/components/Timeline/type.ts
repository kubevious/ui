export type ChartData = {
    dateMoment: moment.Moment
    date: string
    changes: number
    error: number
    warn: number
}

export type Actual = {
    to?: moment.Moment;
    from: moment.Moment;
}
