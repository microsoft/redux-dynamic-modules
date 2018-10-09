import { default as createSagaMiddleware, SagaMiddleware } from "redux-saga";
import { IExtension, IItemManager, getRefCountedManager, IModuleManager } from "redux-dynamic-modules";
import { ISagaRegistration, ISagaModule } from "./Contracts";
import { getSagaManager } from "./SagaManager";
import { sagaEquals } from "./SagaComparer";

/**
 * Get an extension that integrates saga with the store
 * @param sagaContext The context to provide to the saga
 */
export function getSagaExtension<C>(sagaContext?: C): IExtension {
    let sagaMonitor = undefined;

    //@ts-ignore
    if (__DEV__) {
        sagaMonitor = window["__SAGA_MONITOR_EXTENSION__"] || undefined;
    }

    // setup the saga middleware
    let sagaMiddleware: SagaMiddleware<C> = createSagaMiddleware<any>(
        {
            context: sagaContext,
            sagaMonitor
        }
    );

    let _sagaManager: IItemManager<ISagaRegistration<any>> = getRefCountedManager(getSagaManager(sagaMiddleware), sagaEquals);

    return {
        middleware: [sagaMiddleware],

        onModuleManagerCreated: (moduleManager: IModuleManager) => {
            if (sagaContext) {
                sagaContext["moduleManager"] = moduleManager;
            }
        },

        onModuleAdded: (module: ISagaModule<any>): void => {
            if (module.sagas) {
                _sagaManager.add(module.sagas);
            }
        },

        onModuleRemoved: (module: ISagaModule<any>): void => {
            if (module.sagas) {
                _sagaManager.remove(module.sagas);
            }
        },

        dispose: () => {
            _sagaManager.dispose();
            _sagaManager = null;
            sagaMiddleware = null;
        }
    }
}