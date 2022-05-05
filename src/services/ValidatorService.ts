import { BaseHttpService } from '@kubevious/ui-framework'
import { IValidatorConfigService } from '@kubevious/ui-middleware'
import { ValidatorID, ValidationConfig } from '@kubevious/entity-meta'
import { ValidatorIdBody, ValidatorItem } from '@kubevious/ui-middleware/dist/services/validator-config';

export class ValidatorService extends BaseHttpService implements IValidatorConfigService  {
    
    getValidators() {
        return this.client
            .get<ValidationConfig>('/')
            .then((result) => result.data)
    }

    getValidator(validatorId: ValidatorID) {
        const body : ValidatorIdBody = {
            validator: validatorId
        }
        return this.client
            .get<ValidatorItem, {}, ValidatorIdBody>('/get', body)
            .then((result) => result.data)
    }

    updateValidator(item: ValidatorItem) {

        return this.client
            .post('/set', {}, item)
            .then((result) => result.data)
    }
}