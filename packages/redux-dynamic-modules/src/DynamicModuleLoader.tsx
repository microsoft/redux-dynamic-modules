import * as React from "react";
import * as PropTypes from "prop-types";
import { IModule, IModuleStore, IDynamicallyAddedModule } from "./Contracts";
//@ts-ignore
import { Provider, ReactReduxContext } from "react-redux";

export interface IDynamicModuleLoaderProps<OriginalState, AdditionalState> {
    /** Modules that need to be dynamically registerd */
    modules: IModule<AdditionalState>[];

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
export class DynamicModuleLoader<
    OriginalState,
    AdditionalState
> extends React.Component<
    IDynamicModuleLoaderProps<OriginalState, AdditionalState>
> {
    // @ts-ignore
    private static contextTypes = {
        store: PropTypes.object,
    };

    constructor(
        props: IDynamicModuleLoaderProps<OriginalState, AdditionalState>,
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
    modules: IModule<any>[];

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

        const flattenedModules = flattenModules(modules);
        this._addedModules = store.addModules(flattenedModules);
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

function flattenModules(arr) {
    const res = arr.slice();
    let i = 0;

    while (i < res.length) {
        if (Array.isArray(res[i])) {
            res.splice(i, 1, ...res[i]);
        }
        else {
            i++;
        }
    }

    return res;
}
