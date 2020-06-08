import MockRootApiService from './services-mock/MockRootApiService'
import RootApiService from './services/RootApiService'

export const api = process.env.REACT_APP_MOCKED_DATA === 'true' ? MockRootApiService : RootApiService