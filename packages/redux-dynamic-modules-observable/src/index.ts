import { createEpicMiddleware } from "redux-observable";
import { IExtension } from "redux-dynamic-modules";

export function getObservableExtension(): IExtension {
    const epicMiddleware = createEpicMiddleware();

    return {
        middleware: [epicMiddleware]
    };
}
