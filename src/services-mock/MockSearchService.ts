import _ from "the-lodash"

import { getRandomDnList } from "./utils"

import { ISharedState } from "@kubevious/ui-framework"

import { ISearchService } from "@kubevious/ui-middleware"
import { MockRootApiService } from "./MockRootApiService"

export class MockSearchService implements ISearchService {

    constructor(parent: MockRootApiService, sharedState: ISharedState) {
        
    }

    close() {
    }

   
    fetchSearchResults(criteria, cb) {
        if (!criteria) {
            cb([])
            return
        }
        let res = getRandomDnList()
        let res2 = res.map((x) => ({
            dn: x,
        }))
        cb(res2)
    }

    autocompleteLabelKeys(criteria: string, cb: (data: string[]) => any)
    {
        
    }

    autocompleteLabelValues(key: string, criteria: string, cb: (data: string[]) => any)
    {
        
    }

    autocompleteAnnotationKeys(criteria: string, cb: (data: string[]) => any)
    {
        
    }

    autocompleteAnnotationValues(key: string, criteria: string, cb: (data: string[]) => any)
    {

    }

}
