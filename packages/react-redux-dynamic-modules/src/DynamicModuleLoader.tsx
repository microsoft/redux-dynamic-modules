import * as PropTypes from "prop-types";
import * as React from "react";
//@ts-ignore
import { Provider, ReactReduxContext } from "react-redux";

import { IDynamicallyAddedModule, IModuleStore, IModuleTuple } from "./Contracts";

export interface IDynamicModuleLoaderProps {
    /** Modules that need to be dynamically registerd */
    modules: IModuleTuple[];

    /** Optional callback which returns a store instance. This would be called if no store could be loaded from the context. */
    createStore?: () => IModuleStore<any>;
}

export interface IDynamicModuleLoaderContext {
    store: IModuleStore<any>;
}

/**
 * The DynamicModuleLoader adds a way to register a module on mount
 * When this component is initialized, the reducer and saga from the module passed as props will be registered with the system
 * On unmount, they will be unregistered
 */
export class DynamicModuleLoader extends React.Component<
    IDynamicModuleLoaderProps
    > {
    // @ts-ignore
    private static contextTypes = {
        store: PropTypes.object,
    };

    constructor(
        props: IDynamicModuleLoaderProps,
        context: IDynamicModuleLoaderContext
    ) {
        super(props, context);
    }

    /**
     * Render a Redux provider
     */
    public render(): React.ReactNode {
        if (ReactReduxContext) {
            return (
                <ReactReduxContext.Consumer>
                    {context => {
                        return (
                            <DynamicModuleLoaderImpl
                                createStore={this.props.createStore}
                                store={context ? context.store : undefined}
                                modules={this.props.modules}>
                                {this.props.children}
                            </DynamicModuleLoaderImpl>
                        );
                    }}
                </ReactReduxContext.Consumer>
            );
        } else {
            return (
                <DynamicModuleLoaderImpl
                    // @ts-ignore
                    store={this.context.store}
                    modules={this.props.modules}>
                    {this.props.children}
                </DynamicModuleLoaderImpl>
            );
        }
    }
}

interface IDynamicModuleLoaderImplProps {
    /** Modules that need to be dynamically registerd */
    modules: IModuleTuple;

    store: IModuleStore<any>;

    createStore?: () => IModuleStore<any>;
}

class DynamicModuleLoaderImpl extends React.Component<
    IDynamicModuleLoaderImplProps
    > {
    private _addedModules?: IDynamicallyAddedModule;
    private _providerInitializationNeeded: boolean = false;
    private _store: IModuleStore<any>;

    constructor(props: IDynamicModuleLoaderImplProps) {
        super(props);
        const { createStore, modules, store } = props;
        this._store = store;
        if (!this._store) {
            if (createStore) {
                this._store = createStore();
                this._providerInitializationNeeded = true;
            } else {
                throw new Error(
                    "Store could not be resolved from React context"
                );
            }
        }

        this._addedModules = store.addModules(modules);
    }

    public render(): React.ReactNode {
        if (this._providerInitializationNeeded) {
            return (
                <Provider store={this.props.store}>
                    {this.props.children}
                </Provider>
            );
        } else {
            return this.props.children;
        }
    }

    /**
     * Unregister sagas and reducers
     */
    public componentWillUnmount(): void {
        if (this._addedModules) {
            this._addedModules.remove();
            this._addedModules = undefined;
        }
    }
}


