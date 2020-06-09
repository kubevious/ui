
class BaseRootApiService {

    constructor(sharedState)
    {
        this._sharedState = sharedState;
        this._servicesDict = {};
    }

    get sharedState() {
        return this._sharedState;
    }

    registerService(kind, params, cb)
    {
        this._servicesDict[kind] = {
            params: params,
            cb: cb
        };
    }

    resolveService(info)
    {
        if (!info.kind) {
            throw new Error("Service kind not set");
        }
        if (!this._servicesDict[info.kind]) {
            throw new Error("Unknown service: " + info.kind);
        }

    }

}

export default BaseRootApiService

