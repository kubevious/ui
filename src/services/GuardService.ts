import { BaseHttpService } from '@kubevious/ui-framework';

import {
    ChangePackageItemDetails,
    ChangePackageListResult,
    IGuardService
} from '@kubevious/ui-middleware/dist/services/guard';

export class GuardService extends BaseHttpService implements IGuardService {

    getItems(lastId?: string)
    {
        const params: { last_id? : string } = {
            last_id: lastId,
        };
        return this.client.get<ChangePackageListResult>('/changes', params)
            .then(result => {
                return result?.data;
            })
    }

    getDetails(id: string)
    {
        return this.client.get<ChangePackageItemDetails>('/change/details', 
            {
                id: id,
            })
            .then(result => {
                return result?.data ?? null;
            })
    }

}
