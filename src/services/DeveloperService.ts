import { Promise } from 'the-promise';
import { BaseHttpService } from '@kubevious/ui-framework'
import { IDeveloperService } from '@kubevious/ui-middleware';

export class DeveloperService extends BaseHttpService implements IDeveloperService
{

    extractExtras() 
    {
        const data : Record<string, any> = {
        };

        return Promise.resolve(data);
    }

}
