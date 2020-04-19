import { IExtension } from "redux-dynamic-modules-core";
import { EpicMiddleware } from "redux-observable";
import { getEpicManager } from "./EpicManager";
import { IEpicModule } from "./Contracts";

export * from './Contracts'

export function getObservableExtension(_epicMiddleware: EpicMiddleware<any>): IExtension {
    const epicMiddleware = _epicMiddleware;
    const epicManager = getEpicManager(epicMiddleware);

    return {
        middleware: [epicMiddleware],
        onModuleAdded: (module: IEpicModule<any>) => {
            if (module.epics) {
                epicManager.add(module.epics);
            }
        },
        onModuleRemoved: (module: IEpicModule<any>) => {
            if (module.epics) {
                epicManager.remove(module.epics);
            }
        },
        dispose: () => {
            epicManager.dispose();
        },
    };
}
