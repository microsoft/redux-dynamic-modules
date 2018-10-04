import { default as createSagaMiddleware, SagaMiddleware } from "redux-saga";
import { IPlugin, IItemManager, getRefCountedManager } from "redux-dynamic-modules";
import { ISagaRegistration, ISagaModule } from "./Contracts";
import { getSagaManager } from "./SagaManager";
import { sagaEquals } from "./SagaComparer";

export function getSagaPlugin<C>(sagaContext?: C): IPlugin {
    // setup the saga middleware
    const sagaMonitor = window["__SAGA_MONITOR_EXTENSION__"] || undefined;
    const sagaMiddleware: SagaMiddleware<C> = createSagaMiddleware<any>(
        {
            context: sagaContext,
            sagaMonitor
        }
    );

    const _sagaManager: IItemManager<ISagaRegistration<any>> = getRefCountedManager(getSagaManager(sagaMiddleware), sagaEquals);

    return {
        middleware: [sagaMiddleware],
        onModuleAdded: (module: ISagaModule<any>): void => {
            if (module.sagas) {
                _sagaManager.add(module.sagas);
            }
        },
        onModuleRemoved: (module: ISagaModule<any>): void => {
            if (module.sagas) {
                _sagaManager.remove(module.sagas);
            }
        }
    }
}