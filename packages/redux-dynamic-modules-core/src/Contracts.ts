import { AnyAction, ReducersMapObject, Store, Middleware } from "redux";
import { ActionWithPayload } from "./ActionHelper"

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
    reducerMap?: ReducersMapObject<State, ActionWithPayload<any, any>>;

    /**
     * Middlewares to add to the store
     */
    middlewares?: Middleware[];

    /**
     * These actions are dispatched immediately after adding the module in the store
     */
    initialActions?: AnyAction[];

    /**
     * These actions are dispatched immediatly before removing the module from the store
     */
    finalActions?: AnyAction[];

    /**
     * Specifies if the module is retained forever in the store
     */
    retained?: boolean;
}

export interface IExtension {
    middleware?: any[];
    onModuleManagerCreated?: (moduleManager: IModuleManager) => void;
    onModuleAdded?: (module: IModule<any>) => void;
    onModuleRemoved?: (module: IModule<any>) => void;
    dispose?: () => void;
}

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
    addModule: (module: IModule<any>) => IDynamicallyAddedModule;
    /**
     * Adds the given set of modules to the store
     */
    addModules: (modules: IModuleTuple) => IDynamicallyAddedModule;
}

export type IModuleStore<State> = Store<State> &
    IModuleManager & {
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

type IModuleTupleRecursive = IModule<any> | IModuleTuple;

export interface IModuleTuple extends Array<IModuleTupleRecursive> {}
