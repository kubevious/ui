import { GoldenLayoutComponent } from "."
import { components } from "./types"

export class RegisterComponents {
    private _parent: GoldenLayoutComponent
    constructor(parent) {
        this._parent = parent

        this.setupComponents()
    }

    setupComponents() {
        components.forEach(component => {
            this._parent._register(component)
        })
    }
}
