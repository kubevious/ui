import { GoldenLayoutComponent } from "../GoldenLayout";
import { Component } from "../GoldenLayout/types";
import { Error } from "../ErrorBox/types";

export type RootState = {
    showPopup: boolean
    popupContent: any
    layout: GoldenLayoutComponent | null
    windows: Component[]
    isError: boolean
    error: Error | null
}
