import { IUserService } from '@kubevious/ui-middleware'


export class MockUserService implements IUserService {

    accessToken(): string {
        return 'Token'
    }
    userData(): string {
        return '{ userData: data }'
    }
    close() {}
}