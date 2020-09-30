import { timelineData } from './timelineBoot'

export const timelinePreviewData = timelineData.filter((elem, index) => index % 60 === 0);