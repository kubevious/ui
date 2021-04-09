import { ISearchService } from '@kubevious/ui-middleware';
import { BaseService } from './BaseService'

export class SearchService extends BaseService implements ISearchService {

    fetchSearchResults(criteria, cb) {
        if (Object.keys(criteria).length === 0) {
            cb([]);
            return;
        }

        return this.client.post('/diagram/search', {}, criteria)
            .then(result => {
                cb(result.data);
            })
    }

    autocompleteLabelKeys(criteria: string, cb: (data: string[]) => any)
    {
        const body = {
            criteria: criteria
        }
        return this.client.post<string[]>(`/search/labels`, {}, body)
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
        return this.client.post<string[]>(`/search/labels/values`, {}, body)
            .then(result =>
                cb(result.data))
    }


    autocompleteAnnotationKeys(criteria: string, cb: (data: string[]) => any)
    {
        const body = {
            criteria: criteria
        }
        return this.client.post<string[]>(`/search/annotations`, {}, body)
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
        return this.client.post<string[]>(`/search/annotations/values`, {}, body)
            .then(result =>
                cb(result.data))
    }

}
