export const VISUAL_NODE_COLOR_TABLE = [
    "#7C90BF",
    "#F58D61",
    "#66C2A5",
    "#80B1D2",
    "#A6D853",
    "#E2A78E",
    "#E789C2",
    "#BDB9DA",
    "#BD7637",
    "#D23AEE",
    "#8331CB",
    "#BBBBBB",
]

export const SEVERITY_BG_COLOR_ERROR = "#ff0000"
export const SEVERITY_BG_COLOR_WARN = "#f58142"

export const NODE_RENDER_METADATA = {
    default: {
        arrange: "vertically",
        padding: 15,
        expanded: false,
    },
    per_kind: {
        root: {
            arrange: "horizontally",
            expanded: true,
        },
        ns: {
            expanded: true,
        },
        app: {},
        cont: {
            arrange: "pack",
        },
        replicaset: {
            arrange: "pack",
        },
        raw: {},
    },
}
