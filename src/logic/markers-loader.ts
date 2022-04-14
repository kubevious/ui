import _ from 'the-lodash'
import { app, BaseService, IService } from "@kubevious/ui-framework"
import { IMarkerService } from "@kubevious/ui-middleware/dist/services/marker"

export class MarkersLoader extends BaseService
{
    private _service : IMarkerService;
    private _subscription : IService | null = null;

    constructor()
    {
        super()

        this._service = app.serviceRegistry.resolveService<IMarkerService>({ kind: 'marker' });
        this.registerResource(this._service);

        this.sharedState.subscribe("need_markers_list", () => {
            if (this.sharedState.isUserPresent("need_markers_list")) {
                this._setupSubscription();
            } else {
                this._removeSubscription();
            }
        });

        this._cleanupState();
    }

    close() {
        this._removeSubscription();

        super.close();
    }

    private _cleanupState()
    {
        this.sharedState.set('markers_dict', null);
        this.sharedState.set('markers_list', null);
    }

    private _setupSubscription()
    {
        this.sharedState.set('markers_dict', {});
        this.sharedState.set('markers_list', []);

        if (this._subscription) {
            this._subscription.close();
        }

        this._subscription = this._service.subscribeMarkers((items) => {

            const markersList = items ?? [];

            const markerDict = _.makeDict(
                markersList,
                x => x.name,
                x => x);

            this.sharedState.set("markers_dict", markerDict);
            this.sharedState.set("markers_list", markersList);

        });
    }

    private _removeSubscription()
    {
        if (this._subscription) {
            this._subscription.close();
            this._subscription = null;
        }

        this._cleanupState();
    }
}
