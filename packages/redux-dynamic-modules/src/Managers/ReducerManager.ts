import {
    combineReducers,
    Reducer,
    ReducersMapObject,
    AnyAction
} from "redux";
import { getStringRefCounter } from "../Utils/RefCounter";

export interface IReducerManager<S> {
    reduce: (state: S, action: AnyAction) => S;
    getReducerMap: () => ReducersMapObject<S>;
    add: <ReducerState>(key: string, reducer: Reducer<ReducerState>) => void;
    remove: (key: string) => void;
}

/**
 * Adds reference counting to reducer manager and adds/remove keys only when ref count is zero
 */
export function getRefCountedReducerManager<S>(manager: IReducerManager<S>): IReducerManager<S> {
    const reducerKeyRefCounter = getStringRefCounter();
    for (const key in manager.getReducerMap()) {
        reducerKeyRefCounter.add(key);
    }

    return {
        reduce: manager.reduce,
        getReducerMap: manager.getReducerMap,
        add: <ReducerState>(key: string, reducer: Reducer<ReducerState>) => {
            if (reducerKeyRefCounter.getCount(key) === 0) {
                manager.add(key, reducer);
            }

            reducerKeyRefCounter.add(key);
        },
        remove: (key: string) => {
            reducerKeyRefCounter.remove(key);

            if (reducerKeyRefCounter.getCount(key) === 0) {
                manager.remove(key);
            }
        }
    };
}

/**
 * Create a combined reducer as in the fashion of Redux's combineReducers() function,
 * but allows for the dynamic registration of additional reducers
 * @param initialReducers The initial set of reducers
 * @returns An object with three functions: the reducer, an addReducer function, and a removeReducer function
 */
export function getReducerManager<S extends {}>(
    initialReducers: ReducersMapObject<S>
): IReducerManager<S> {
    let rm: ReducersMapObject<S> = {
        ...(initialReducers as object)
    } as ReducersMapObject<S>;
    let combinedReducer = combineReducers(initialReducers);
    const reducers: ReducersMapObject<any> = { ...initialReducers as object };
    let keysToRemove = [];

    const reduce = (state: S, action: AnyAction) => {
        if (keysToRemove.length > 0) {
            state = { ...state as any };
            for (let key of keysToRemove) {
                delete state[key];
            }
            keysToRemove = [];
        }
        return combinedReducer(state, action);
    };

    return {
        getReducerMap: () => rm,
        reduce,
        add: <ReducerState>(key: string, reducer: Reducer<ReducerState>) => {

            if (!key || reducers[key]) {
                return;
            }

            reducers[key] = reducer;
            rm = {
                ...reducers
            } as ReducersMapObject<S>;
            combinedReducer = getCombinedReducer(rm);
        },
        remove: (key: string) => {
            if (!key || !reducers[key]) {
                return;
            }

            delete reducers[key];
            rm = {
                ...reducers
            } as ReducersMapObject<S>;
            keysToRemove.push(key);
            combinedReducer = getCombinedReducer(rm);
        }
    };
}

function getCombinedReducer(reducerMap: ReducersMapObject<any>) {
    if (!reducerMap || Object.keys(reducerMap).length === 0) {
        return (state, action) => state || null;
    }
    return combineReducers(reducerMap);
}

