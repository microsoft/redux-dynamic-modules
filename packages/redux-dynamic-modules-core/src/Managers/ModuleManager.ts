import { IModule, IItemManager, IExtension } from "../Contracts";
import {
    AnyAction,
    ReducersMapObject,
    Dispatch,
    Middleware,
    Reducer,
} from "redux";
import {
    getReducerManager,
    IReducerManager,
    getRefCountedReducerManager,
} from "./ReducerManager";

export interface IModuleManager<State> extends IItemManager<IModule<State>> {
    setDispatch: (dispatch: Dispatch<AnyAction>) => void;
    getReducer: (state: State, action: AnyAction) => State;
}

export function getModuleManager<State = {}>(
    middlewareManager: IItemManager<Middleware>,
    extensions: IExtension[],
    advancedCombineReducers?: (
        reducers: ReducersMapObject<State, any>
    ) => Reducer<State>
): IModuleManager<State> {
    let _dispatch = null;
    let _reducerManager: IReducerManager<State>;
    let _modules: IModule<any>[] = [];
    const _moduleIds = new Set();

    const _seedReducers = () => {
        _dispatch({ type: "@@Internal/ModuleManager/SeedReducers" });
    };

    const _dispatchActions = (actions: AnyAction[]) => {
        if (!actions) {
            return;
        }

        if (!_dispatch) {
            throw new Error(
                "setDispatch should be called on ModuleManager before adding any modules."
            );
        }

        actions.forEach(_dispatch);
    };

    const _addMiddlewares = (middlewares: Middleware[]) => {
        if (!middlewares) {
            return;
        }
        middlewareManager.add(middlewares);
    };

    const _removeMiddlewares = (middlewares: Middleware[]) => {
        if (!middlewares) {
            return;
        }
        middlewareManager.remove(middlewares);
    };

    const _addReducers = (
        reducerMap: ReducersMapObject<Reducer, AnyAction>
    ) => {
        if (!reducerMap) {
            return;
        }
        if (!_reducerManager) {
            _reducerManager = getRefCountedReducerManager(
                // @ts-ignore
                getReducerManager(reducerMap, advancedCombineReducers)
            ) as any;
        } else {
            for (const key in reducerMap) {
                _reducerManager.add(key, reducerMap[key]);
            }
        }
    };

    const _removeReducers = (
        reducerMap: ReducersMapObject<Reducer, AnyAction>
    ) => {
        if (!reducerMap || !_reducerManager) {
            return;
        }
        for (const key in reducerMap) {
            _reducerManager.remove(key);
        }
    };
    // Create reduce function which redirects to _reducers.reduce
    const _reduce = (s: State, a: AnyAction) => {
        if (_reducerManager) {
            return _reducerManager.reduce(s, a);
        }
        return s || null;
    };

    const moduleManager = {
        getReducer: _reduce,
        setDispatch: (dispatch: Dispatch<AnyAction>) => {
            _dispatch = dispatch;
        },
        getItems: () => [], //We are not keeping a copy of added modules, for now no one calls this so we are ok
        add: (modulesToAdd: IModule<any>[]) => {
            if (!modulesToAdd || modulesToAdd.length === 0) {
                return;
            }
            modulesToAdd = modulesToAdd.filter(module => module);
            const justAddedModules: IModule<any>[] = [];
            modulesToAdd.forEach(module => {
                if (!_moduleIds.has(module.id)) {
                    _moduleIds.add(module.id);
                    _modules.push(module);
                    _addReducers(module.reducerMap);

                    const middlewares = module.middlewares;
                    if (middlewares) {
                        _addMiddlewares(middlewares);
                    }
                    justAddedModules.push(module);
                }
            });

            /* Fire an action so that the newly added reducers can seed their initial state */
            _seedReducers();

            // add the sagas and dispatch actions at the end so all the reducers are registered
            justAddedModules.forEach(module => {
                // Let the extensions know we added a module
                extensions.forEach(p => {
                    if (p.onModuleAdded) {
                        p.onModuleAdded(module);
                    }
                });

                // Dispatch the initial actions
                const moduleAddedAction = {
                    type: "@@Internal/ModuleManager/ModuleAdded",
                    payload: module.id,
                };
                _dispatchActions(
                    module.initialActions
                        ? [moduleAddedAction, ...module.initialActions]
                        : [moduleAddedAction]
                );
            });
        },
        remove: (modulesToRemove: IModule<any>[]) => {
            if (!modulesToRemove) {
                return;
            }
            modulesToRemove = modulesToRemove
                .filter(module => module)
                .reverse();
            modulesToRemove.forEach(module => {
                if (_moduleIds.has(module.id)) {
                    _dispatchActions(module.finalActions);

                    _removeReducers(module.reducerMap);
                    _removeMiddlewares(module.middlewares);

                    // Let the extensions know we removed a module
                    extensions.forEach(p => {
                        if (p.onModuleRemoved) {
                            p.onModuleRemoved(module);
                        }
                    });

                    _moduleIds.delete(module.id);
                    _modules = _modules.filter(m => m.id !== module.id);

                    _dispatchActions([
                        {
                            type: "@@Internal/ModuleManager/ModuleRemoved",
                            payload: module.id,
                        },
                    ]);
                }
            });
        },
        dispose: () => {
            moduleManager.remove(_modules);
        },
    };
    return moduleManager;
}
