import { AnyAction, ReducersMapObject, Store, Middleware } from "redux";

/**
 * Represents a module which is set of reducers, sagas, initial actions and final actions
 */
export interface IModule<State> {
    /**
     * Id of the module
     */
    id: string;

    /**
     * Reducers for the module
     */
    reducerMap?: ReducersMapObject<State, AnyAction>;

    /**
     * Middlewares to add to the store
     */
    middlewares?: Middleware[];

    /**
     * These sagas are executed immediately after adding the module to the store (before dispatching initial actions)
     */
    sagas?: ISagaRegistration<any>[];

    /**
     * These actions are dispatched immediately after adding the module in the store
     */
    initialActions?: AnyAction[];

    /**
     * These actions are dispatched immediatly before removing the module from the store
     */
    finalActions?: AnyAction[];
}

export interface ISagaWithArguments<T> {
    saga: (argument?: T) => Iterator<any>;
    argument?: T;
}

export type ISagaRegistration<T> = (() => Iterator<any>) | ISagaWithArguments<T>;

export interface IDynamicallyAddedModule {
    /**
     * Call to remove the module from the store
     */
    remove: () => void;
}

export interface IModuleManager {
    /**
     * Add the given module to the store
     */
    addModule: (...modules: IModule<any>[]) => IDynamicallyAddedModule
}

export type IModuleStore<State> = Store<State> & IModuleManager & {
    /**
     * Remove all the modules from the store
     */
    dispose: () => void;
};

export interface IItemManager<T> {
    getItems: () => T[];
    add: (items: T[]) => void;
    remove: (item: T[]) => void;
    dispose: () => void;
}
