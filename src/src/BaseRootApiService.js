import _ from 'the-lodash'

class BaseRootApiService {

    constructor(sharedState)
    {
        this._sharedState = sharedState;
        this._servicesDict = {};
    }

    get sharedState() {
        return this._sharedState;
    }

    registerService(info, cb)
    {
        if (!info.kind) {
            throw new Error("Service kind not set");
        }

        var svcInfo = {
            info: info,
            cb: cb
        };
        svcInfo.services = {};
        this._servicesDict[info.kind] = svcInfo;
    }

    resolveService(info)
    {
        if (!info.kind) {
            throw new Error("Service kind not set");
        }
        var svcInfo = this._servicesDict[info.kind];
        if (!svcInfo) {
            throw new Error("Unknown service: " + info.kind);
        }

        var key = _.stableStringify(info);
        var service = svcInfo.services[key];
        if (service) {
            return service;
        }

        service = svcInfo.cb({
            info, 
            sharedState: this.sharedState,
            parent: this
        });
        
        if (service.setSharedState) {
            service.setSharedState(this.sharedState);
        }

        if (service.setParent) {
            service.setParent(this);
        }

        if (service.init) {
            service.init();
        }

        svcInfo.services[key] = service;
        return service;
    }

}

export default BaseRootApiService

