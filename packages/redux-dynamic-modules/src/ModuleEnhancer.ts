import {
    applyMiddleware,
    DeepPartial,
    StoreEnhancer,
    StoreCreator,
    Reducer,
    Action,
    compose as composeEnhancers
} from "redux";
import { IModule, IExtension, IModuleStore } from "./Contracts";
import { getModuleManager } from "./Managers/ModuleManager";
import { getRefCountedManager } from "./Managers/RefCountedManager";
import { getMiddlewareManager } from './Managers/MiddlewareManager';

/**
 * Adds dynamic module management capabilities to a redux store.
 * @param extensions: Optional. Any extensions for the store e.g. to support redux-saga or redux-thunk
 * @param initialModules: Optional. Any modules to bootstrap the store with  
 */
export function moduleEnhancer<S1>(
    extensions: IExtension[] = [],
    initialModules: IModule<S1>[] = []): StoreEnhancer<IModuleStore<S1>, S1> {

    return (createStore: StoreCreator) =>
        <S, A extends Action, Ext>(
            baseReducer?: Reducer<S, A>,
            preloadedState?: DeepPartial<S>,
            baseEnhancer?: StoreEnhancer<Ext>) => {

            // get middlewares from extensions if any
            const extensionMiddlewares = extensions.reduce(
                (mw, p) => {
                    if (p.middleware) {
                        mw.push(...p.middleware)
                    }
                    return mw;
                },
                []
            );

            // create manager to  manage dynamic middlewares
            const middlewareManager = getRefCountedManager(
                getMiddlewareManager(),
                (a, b) => a === b);

            // create module manager
            const moduleManager = getRefCountedManager(
                getModuleManager<any>(
                    middlewareManager,
                    extensions),
                (a: IModule<any>, b: IModule<any>) => a.id === b.id);

            // Create module enhancer to manage extensions and dynamic middlewares
            const moduleEnhancer = composeEnhancers(
                applyMiddleware(...extensionMiddlewares,
                    middlewareManager.enhancer));

            // compose the moduleEnahancer with the enhancers passed, the order matters as we want to be additive
            // so the right parameter is the enhancer we received
            const composedEnhancer =
                (baseEnhancer ?
                    composeEnhancers(moduleEnhancer, baseEnhancer) :
                    moduleEnhancer);

            // build a chained reducer
            const chainedReducer = (state, action) => {
                // call the passed in reducer first
                const intermediateState = baseReducer ? baseReducer(state, action) : state;
                // then delegate to the module managers reducer
                return moduleManager.getReducer(intermediateState, action);
            };

            // Create the store
            const store = createStore(chainedReducer, preloadedState, composedEnhancer);

            // module manager will use the dispatch from store to dispatch initial and final actions
            moduleManager.setDispatch(store.dispatch);

            // adds given modules to mouldManager
            const addModules = (modulesToBeAdded: IModule<any>[]) => {
                moduleManager.add(modulesToBeAdded);
                return {
                    remove: () => {
                        moduleManager.remove(modulesToBeAdded);
                    }
                };
            }

            // Adds the module to the module manager
            const addModule = (moduleToBeAdded: IModule<any>) => {
                return addModules([moduleToBeAdded]);
            };


            const dispose = () => {
                // get all added modules and remove them
                moduleManager.dispose();
                middlewareManager.dispose();
                extensions.forEach(p => {
                    if (p.dispose) {
                        p.dispose();
                    }
                });
            };

            // Allow extensions to react when modules are added
            extensions.forEach(p => {
                if (p.onModuleManagerCreated) {
                    p.onModuleManagerCreated({
                        addModule,
                        addModules
                    });
                }
            });

            const moduleStore = {
                addModule,
                addModules,
                dispose
            }

            // Add the initial modules
            moduleStore.addModules(initialModules);
            return {
                ...store as any,
                ...moduleStore
            };
        }
}