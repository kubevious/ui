import { IUserService } from '@kubevious/ui-middleware'
import { BaseHttpService } from '@kubevious/ui-framework'


export class UserService extends BaseHttpService implements IUserService {

    accessToken(): string {
        return `Bearer ${localStorage.token}`
    }
    userData(): string {
        return localStorage.userData
    }
}