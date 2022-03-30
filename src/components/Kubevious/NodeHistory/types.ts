import { HistoryHierarchyEntry, HistoryNodeEntry } from "@kubevious/ui-middleware/dist/services/history/types";

export const QUERY_NODE = 'Self';
export const QUERY_HIERARCHY = 'Subtree';

export interface ObjectChangeHistory
{
    queryType: string;
    dn: string;
    currentToken?: string;

    nodeEntries: HistoryNodeEntry[];
    hierarchyEntries: HistoryHierarchyEntry[];

    nextToken?: string;
}