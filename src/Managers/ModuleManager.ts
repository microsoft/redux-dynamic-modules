import { IModule, ISagaRegistration, IItemManager } from "../Contracts";
import { AnyAction, ReducersMapObject, Dispatch, Reducer } from "redux";
import { getReducerManager, IReducerManager, getRefCountedReducerManager } from "./ReducerManager";
import { getSagaManager } from "./SagaManager";
import { SagaMiddleware } from "redux-saga";
import { getRefCountedManager } from "./RefCountedManager";
import { equals as sagaEquals } from "../Utils/SagaComparer";

export interface IModuleManager<State> extends IItemManager<IModule<State>> {
    setDispatch: (dispatch: Dispatch<AnyAction>) => void;
    getReducer: (state: State, action: AnyAction) => State;
}

export function getModuleManager<SagaContext, State>(sagaMiddleware: SagaMiddleware<SagaContext>): IModuleManager<State> {
    let _dispatch = null;
    let _reducerManager: IReducerManager<State>;
    const _sagaManager: IItemManager<ISagaRegistration<any>> = getRefCountedManager(getSagaManager(sagaMiddleware), sagaEquals);
    const _addedModules: Set<any> = new Set();

    const _dispatchActions = (moduleId: string, actions: AnyAction[]) => {
        if (!actions) {
            return;
        }

        if (!_dispatch) {
            throw new Error("setDispatch should be called on ModuleManager before adding any modules.");
        }

        actions.forEach(_dispatch);
    }

    const _addSagas = (sagas: ISagaRegistration<any>[]) => {
        if (!sagas) {
            return;
        }
        _sagaManager.add(sagas);
    }

    const _removeSagas = (sagas: ISagaRegistration<any>[]) => {
        if (!sagas) {
            return;
        }
        _sagaManager.remove(sagas);
    }

    const _addReducers = (reducerMap: ReducersMapObject<Reducer, AnyAction>) => {
        if (!reducerMap) {
            return;
        }
        if (!_reducerManager) {
            _reducerManager = getRefCountedReducerManager(getReducerManager(reducerMap)) as any;
        } else {
            for (const key in reducerMap) {
                _reducerManager.add(key, reducerMap[key]);
            }
        }

        _dispatch && _dispatch({ type: "@@Internal/ModuleManager/ReducerAdded" });
    }

    const _removeReducers = (reducerMap: ReducersMapObject<Reducer, AnyAction>) => {
        if (!reducerMap || !_reducerManager) {
            return;
        }
        for (const key in reducerMap) {
            _reducerManager.remove(key);
        }
    }
    // Create reduce function which redirects to _reduers.reduce
    const _reduce = (s: State, a: AnyAction) => {
        if (_reducerManager) {
            return _reducerManager.reduce(s, a);
        }
        return (s || null);
    };

    return {
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
                if (!_addedModules.has(module.id)) {
                    _addedModules.add(module.id);
                    _addReducers(module.reducerMap);
                    justAddedModules.push(module);
                }
            });

            // add the sagas and dispatch actions at the end so all the reducers are registered
            justAddedModules.forEach(module => {
                // Running the sagas after registering the reducers as they sagas themselve might dispatch actions
                // and we want all reducers to be registered before dispatching any actions
                _addSagas(module.sagas);
                _dispatchActions(module.id, module.initialActions);
            });
        },
        remove: (modulesToRemove: IModule<any>[]) => {
            if (!modulesToRemove) {
                return;
            }
            modulesToRemove = modulesToRemove.filter(module => module);
            modulesToRemove.forEach(module => {

                if (_addedModules.has(module.id)) {
                    _dispatchActions(module.id, module.finalActions);

                    _removeReducers(module.reducerMap);
                    _removeSagas(module.sagas);
                    _addedModules.delete(module.id);

                    _dispatch && _dispatch({ type: "@@Internal/ModuleManager/ModuleRemoved" });
                }
            });
        }
    };
}
