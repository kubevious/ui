import { BaseService } from './BaseService'
import moment from 'moment'
import { HttpClient, ISharedState } from '@kubevious/ui-framework';
import { ISearchService, IWebSocketService } from '@kubevious/ui-middleware';

export class SearchService extends BaseService implements ISearchService {

    constructor(client: HttpClient, sharedState: ISharedState, socket: IWebSocketService)
    {
        super(client, sharedState, socket)

    }

    fetchSearchResults(criteria, cb) {
        if (Object.keys(criteria).length === 0) {
            cb([]);
            return;
        }

        return this.client.post('/diagram/search', criteria)
            .then(result => {
                cb(result.data);
            })
    }

    autocompleteLabelKeys(criteria: string, cb: (data: string[]) => any)
    {
        const body = {
            criteria: criteria
        }
        return this.client.post<string[]>(`/search/labels`, body)
            .then(result =>
                cb(result.data)
            )
    }

    autocompleteLabelValues(key: string, criteria: string, cb: (data: string[]) => any)
    {
        const body = {
            key: key,
            criteria: criteria
        }
        return this.client.post<string[]>(`/search/labels/values`, body)
            .then(result =>
                cb(result.data))
    }


    autocompleteAnnotationKeys(criteria: string, cb: (data: string[]) => any)
    {
        const body = {
            criteria: criteria
        }
        return this.client.post<string[]>(`/search/annotations`, body)
            .then(result =>
                cb(result.data)
            )
    }

    autocompleteAnnotationValues(key: string, criteria: string, cb: (data: string[]) => any)
    {
        const body = {
            key: key,
            criteria: criteria
        }
        return this.client.post<string[]>(`/search/annotations/values`, body)
            .then(result =>
                cb(result.data))
    }

}
