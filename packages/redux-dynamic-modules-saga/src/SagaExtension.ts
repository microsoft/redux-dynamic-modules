import { default as createSagaMiddleware, SagaMiddleware } from "redux-saga";
import {
    IExtension,
    IItemManager,
    getRefCountedManager,
    IModuleManager,
} from "redux-dynamic-modules-core";
import { ISagaRegistration, ISagaModule } from "./Contracts";
import { getSagaManager } from "./SagaManager";
import { sagaEquals } from "./SagaComparer";

type SettingsType<C> = {
    sagaContext?: C;
    onError?: (error: Error) => void;
    middlewares?: any[];
};

/**
 * Get an extension that integrates saga with the store
 * @param sagaContext The context to provide to the saga
 */
export function getSagaExtension<C>(settings: SettingsType<C>): IExtension {
    const { sagaContext = {}, onError, middlewares = [] } = settings;

    let sagaMonitor = undefined;

    //@ts-ignore
    if (
        process.env.NODE_ENV === "development" &&
        typeof window !== "undefined"
    ) {
        sagaMonitor = window["__SAGA_MONITOR_EXTENSION__"] || undefined;
    }

    // Setup the saga middleware
    let sagaMiddleware: SagaMiddleware<C> = createSagaMiddleware<any>({
        context: sagaContext,
        sagaMonitor,
        onError,
    });

    let _sagaManager: IItemManager<
        ISagaRegistration<any>
    > = getRefCountedManager(getSagaManager(sagaMiddleware), sagaEquals);

    return {
        middleware: [...middlewares, sagaMiddleware],
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
        },
    };
}
