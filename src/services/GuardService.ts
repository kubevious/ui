import { BaseHttpService } from '@kubevious/ui-framework';

import {
    ChangePackageItemDetails,
    ChangePackageListResult,
    IGuardService
} from '@kubevious/ui-middleware/dist/services/guard';

export class GuardService extends BaseHttpService implements IGuardService {

    getItems(nextToken?: number)
    {
        const params: { nextToken? : string } = {
            nextToken: nextToken ? nextToken.toString() : undefined,
        };
        return this.client.get<ChangePackageListResult>('/changes', params)
            .then(result => {
                return result?.data;
            })
    }

    getDetails(changeId: string)
    {
        return this.client.get<ChangePackageItemDetails>('/change/details', 
            {
                id: changeId,
            })
            .then(result => {
                return result?.data ?? null;
            })
    }

}
