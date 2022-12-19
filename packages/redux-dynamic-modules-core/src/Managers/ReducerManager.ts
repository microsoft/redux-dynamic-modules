import { combineReducers, Reducer, ReducersMapObject, AnyAction } from "redux";
import { getStringRefCounter } from "../Utils/RefCounter";
import * as has from "lodash/has";
import * as set from "lodash/set";
import * as unset from "lodash/unset";
import * as mapValues from "lodash/mapValues";

export interface IReducerManager<S> {
    reduce: (state: S, action: AnyAction) => S;
    getReducerMap: () => ReducersMapObject<S>;
    add: <ReducerState>(key: string, reducer: Reducer<ReducerState>) => void;
    remove: (key: string) => void;
}

/**
 * Adds reference counting to reducer manager and adds/remove keys only when ref count is zero
 */
export function getRefCountedReducerManager<S>(
    manager: IReducerManager<S>
): IReducerManager<S> {
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
        },
    };
}

/**
 * Create a combined reducer as in the fashion of Redux's combineReducers() function,
 * but allows for the dynamic registration of additional reducers
 * @param initialReducers The initial set of reducers
 * @returns An object with three functions: the reducer, an addReducer function, and a removeReducer function
 */
export function getReducerManager<S extends {}>(
    initialReducers: ReducersMapObject<S>,
    reducerCombiner: (
        reducers: ReducersMapObject<S, any>
    ) => Reducer<S> = combineReducers
): IReducerManager<S> {
    let combinedReducer = reducerCombiner(initialReducers);
    const reducers: ReducersMapObject<S> = {
        ...(initialReducers as object),
    } as ReducersMapObject<S>;
    let keysToRemove = [];

    const reduce = (state: S, action: AnyAction) => {
        if (keysToRemove.length > 0) {
            state = { ...(state as any) };
            for (let key of keysToRemove) {
                unset(state, key);
            }
            keysToRemove = [];
        }

        if (state === undefined) {
            state = {} as S;
        }

        return combinedReducer(state, action);
    };

    return {
        getReducerMap: () => reducers,
        reduce,
        add: <ReducerState>(key: string, reducer: Reducer<ReducerState>) => {
            if (!key || has(reducers, key)) {
                return;
            }

            set(reducers, key, reducer);
            combinedReducer = getCombinedReducer(reducers, reducerCombiner);
        },
        remove: (key: string) => {
            if (!key || !has(reducers, key)) {
                return;
            }

            unset(reducers, key);
            keysToRemove.push(key);
            combinedReducer = getCombinedReducer(reducers, reducerCombiner);
        },
    };
}

function getCombinedReducer<S extends {}>(
    reducerMap: ReducersMapObject<any>,
    reducerCombiner: (
        reducers: ReducersMapObject<S, any>
    ) => Reducer<S> = recursiveCombineReducers
) {
    if (!reducerMap || Object.keys(reducerMap).length === 0) {
        return (state, action) => state || null;
    }
    return reducerCombiner(reducerMap);
}

function recursiveCombineReducers(reducersObj: ReducersMapObject): Reducer {
    const normalReducerMap = mapValues(reducer => {
        if (typeof reducer === "function") {
            return reducer;
        } else {
            return recursiveCombineReducers(reducer);
        }
    })(reducersObj);
    return combineReducers(normalReducerMap);
}
