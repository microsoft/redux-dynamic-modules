import { createEpicMiddleware } from "redux-observable";
import { IExtension } from "redux-dynamic-modules";
import { getEpicManager } from "./EpicManager";
import { IEpicModule } from "./Contracts";

export function getObservableExtension(): IExtension {
    const epicMiddleware = createEpicMiddleware();
    const epicManager = getEpicManager(epicMiddleware);

    epicMiddleware.run(epicManager.rootEpic);

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
        }
    };
}
