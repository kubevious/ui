import { BaseHttpService } from '@kubevious/ui-framework'

import { ISearchService } from '@kubevious/ui-middleware'
import { SearchQueryResult } from '@kubevious/ui-middleware/dist/services/search';

export class SearchService extends BaseHttpService implements ISearchService {

    fetchSearchResults(criteria: any)
    {
        return this.client
            .post<SearchQueryResult>("/results", {}, criteria)
            .then((result) => {
                return result.data;
            });
    }

    autocompleteLabelKeys(criteria)
    {
        return this.client
            .post<string[]>("/labels", {}, { criteria : criteria })
            .then((result) => {
                return result.data;
            });
    }
    
    autocompleteLabelValues(key, criteria)
    {
        return this.client
            .post<string[]>("/labels/values", {}, { key: key, criteria : criteria })
            .then((result) => {
                return result.data;
            });
    }
    
    autocompleteAnnotationKeys(criteria)
    {
        return this.client
            .post<string[]>("/annotations", {}, { criteria : criteria })
            .then((result) => {
                return result.data;
            });
    }
    
    autocompleteAnnotationValues(key, criteria)
    {
        return this.client
            .post<string[]>("/annotations/values", {}, { key: key, criteria : criteria })
            .then((result) => {
                return result.data;
            });
    }
    

}
