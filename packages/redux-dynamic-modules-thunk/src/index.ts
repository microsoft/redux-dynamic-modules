import thunk from "redux-thunk";
import { IExtension } from "redux-dynamic-modules";

export function getThunkExtension(): IExtension {
    return {
        middleware: [thunk]
    }
}