import thunk from "redux-thunk";
import { IExtension } from "redux-dynamic-modules-core";

export function getThunkExtension(): IExtension {
    return {
        middleware: [thunk],
    };
}
