import * as DnUtils from "@kubevious/helpers/dist/dn-utils"
import { Group } from "../../types";

export type PropertiesState = {
    selectedDn: string
    dnParts: DnUtils.RnInfo[]
    dnKind: string
    selectedObjectProps: Group[]
}
