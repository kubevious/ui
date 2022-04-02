import _ from 'the-lodash';
import { ISharedState } from "@kubevious/ui-framework"
import { HistoryService } from "../../../services/HistoryService";

import { ObjectChangeHistory, QUERY_HIERARCHY, QUERY_NODE } from "@kubevious/ui-time-machine";

export class NodeHistorySource {
    private _sharedState: ISharedState
    private _historyService: HistoryService;

    constructor(sharedState: ISharedState, historyService: HistoryService) {
        if (!sharedState) {
            throw new Error("SharedState not provided")
        }
        if (!historyService) {
            throw new Error("HistoryService not provided")
        }

        this._historyService = historyService;

        this._sharedState = sharedState.user();

        this._sharedState.subscribe(['selected_dn', 'change_history_query_type', 'change_history_next_token'],
            ({selected_dn, change_history_query_type, change_history_next_token }) => {
                console.log("[NODE-HISTORY] selected_dn: ", selected_dn);
                console.log("[NODE-HISTORY] change_history_query_type: ", change_history_query_type);
                console.log("[NODE-HISTORY] change_history_next_token: ", change_history_next_token);

                change_history_query_type = change_history_query_type || QUERY_NODE;

                if (selected_dn)
                {
                    {
                        const currentObjHistory = this._sharedState.get('selected_object_history') as ObjectChangeHistory;
                        if (currentObjHistory) {
                            if (currentObjHistory.dn !== selected_dn) {
                                this._sharedState.set('selected_object_history', null);
                                if (change_history_next_token) {
                                    this._sharedState.set('change_history_next_token', null);
                                    return;
                                }
                            }
                            if (currentObjHistory.queryType !== change_history_query_type) {
                                this._sharedState.set('selected_object_history', null);
                                if (change_history_next_token) {
                                    this._sharedState.set('change_history_next_token', null);
                                    return;
                                }
                            }
                        } else {
                            if (change_history_next_token) {
                                this._sharedState.set('change_history_next_token', null);
                                return;
                            }
                        }
                    }

                    {
                        const currentObjHistory = this._sharedState.get('selected_object_history') as ObjectChangeHistory;
                        if (!currentObjHistory) {
                            const newObjHistory = {
                                queryType: change_history_query_type,
                                dn: selected_dn,
                                currentToken: change_history_next_token,
                                nodeEntries: [],
                                hierarchyEntries: []
                            }
                            this._sharedState.set('selected_object_history', newObjHistory);
                        }
                    }
                
                    if (change_history_query_type === QUERY_NODE)
                    {
                        this._historyService.fetchNodeHistory(selected_dn, change_history_next_token)
                            .then(result => {
                                // console.log("[NODE-HISTORY] result: ", result);
                                // const currQueryType = this._sharedState.get('change_history_query_type') || QUERY_NODE;
                                // if ((selected_dn !== this._sharedState.get('selected_dn')) || 
                                //     (change_history_query_type !== currQueryType))
                                // {
                                //     return;
                                // }

                                const currentObjHistory = this._sharedState.get('selected_object_history') as ObjectChangeHistory;
                                if (!currentObjHistory) {
                                    // console.log("[NODE-HISTORY] exit 1");
                                    return;
                                }
                                if (currentObjHistory.dn !== selected_dn) {
                                    // console.log("[NODE-HISTORY] currentObjHistory.dn: ", currentObjHistory.dn);
                                    // console.log("[NODE-HISTORY] selected_dn: ", selected_dn);
                                    // console.log("[NODE-HISTORY] exit 2");
                                    return;
                                }
                                if (currentObjHistory.queryType !== change_history_query_type) {
                                    // console.log("[NODE-HISTORY] exit 3");
                                    return;
                                }

                                const entries = _.concat(currentObjHistory.nodeEntries, result.entries);

                                const newObjHistory : ObjectChangeHistory = {
                                    queryType: change_history_query_type,
                                    dn: selected_dn,
                                    currentToken: change_history_next_token,
                                    nodeEntries: entries,
                                    hierarchyEntries: [],
                                    nextToken: result.nextToken
                                };
                                this._sharedState.set('selected_object_history', newObjHistory);
                            })
                    }

                    if (change_history_query_type === QUERY_HIERARCHY)
                    {
                        this._historyService.fetchHierarchyHistory(selected_dn, change_history_next_token)
                            .then(result => {
                                // console.log("[NODE-HISTORY] HHH result: ", result);

                                // const currQueryType = this._sharedState.get('change_history_query_type') || QUERY_NODE;
                                // if ((selected_dn !== this._sharedState.get('selected_dn')) || 
                                //     (change_history_query_type !== currQueryType))
                                // {
                                //     return;
                                // }

                                const currentObjHistory = this._sharedState.get('selected_object_history') as ObjectChangeHistory;
                                // console.log("[NODE-HISTORY] currentObjHistory:", currentObjHistory);
                                if (!currentObjHistory) {
                                    // console.log("[NODE-HISTORY] HHH exit 1");
                                    return;
                                }
                                if (currentObjHistory.dn !== selected_dn) {
                                    // console.log("[NODE-HISTORY] HHH exit 2");
                                    return;
                                }
                                if (currentObjHistory.queryType !== change_history_query_type) {
                                    // console.log("[NODE-HISTORY] HHH exit 3");

                                    return;
                                }

                                const entries = _.concat(currentObjHistory.hierarchyEntries, result.entries);

                                const newObjHistory : ObjectChangeHistory = {
                                    queryType: change_history_query_type,
                                    dn: selected_dn,
                                    nodeEntries: [],
                                    currentToken: change_history_next_token,
                                    hierarchyEntries: entries,
                                    nextToken: result.nextToken
                                };

                                this._sharedState.set('selected_object_history', newObjHistory);
                            })
                    }

                }
                else
                {
                    this._sharedState.set('selected_object_history', null);
                    this._sharedState.set('change_history_next_token', null);
                }

            })
    }

    close() {
        this._sharedState.close();

        this._sharedState.set('selected_object_history', []);
    }
}