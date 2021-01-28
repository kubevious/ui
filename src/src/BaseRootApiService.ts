import { Service } from './types';
import _ from "lodash";
import stableStringify from 'json-stable-stringify' 

class BaseRootApiService {
    private _sharedState: any
    private _servicesDict: Object

    constructor(sharedState: any)
    {
        this._sharedState = sharedState;
        this._servicesDict = {};
    }

    get sharedState() {
        return this._sharedState;
    }
    
    get serviceKinds() {
        return _.keys(this._servicesDict);
    }

    registerService(info: { kind: string }, cb?: Service | never): void
    {
        if (!info.kind) {
            throw new Error("Service kind not set");
        }

        const svcInfo = {
            info: info,
            cb: cb,
            services: {}
        };
        this._servicesDict[info.kind] = svcInfo;
    }

    closeServicesByKind(kind: string): void
    {
        const svcInfo = this._servicesDict[kind];
        if (svcInfo) {
            for(let service of _.values(svcInfo.services))
            {
                service.close()
            }
            svcInfo.services = {};
        }
    }

    resolveService(info: { kind: string }): Service | never
    {
        if (!info.kind) {
            throw new Error("Service kind not set");
        }
        const svcInfo = this._servicesDict[info.kind];
        if (!svcInfo) {
            throw new Error("Unknown service: " + info.kind);
        }
        
        const key: string = stableStringify(info);
        if (key in svcInfo.services) {
            return svcInfo.services[key];
        }

        let service = svcInfo.cb({
            info, 
            sharedState: this.sharedState,
            parent: this
        });
        
        if (service) {
            if (service.setSharedState) {
                service.setSharedState(this.sharedState);
            }
    
            if (service.setParent) {
                service.setParent(this);
            }
    
            if (service.init) {
                service.init();
            }
        } else {
            service = null;
        }
        
        svcInfo.services[key] = service;
        return service;
    }

}

export default BaseRootApiService
