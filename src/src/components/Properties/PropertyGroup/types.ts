import { Group } from "../../../types";

export type PropertyGroupProps = {
    title: string,
    extraClassTitle: string,
    extraClassContents: string,
    dn: string,
    dnKind: string,
    groupName: string,
    group: Group,
    propertyExpanderHandleClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
}
