import * as PropTypes from "prop-types";
import * as React from "react";
//@ts-ignore
import { Provider, ReactReduxContext } from "react-redux";

import {
    IDynamicallyAddedModule,
    IModuleStore,
    IModuleTuple,
} from "./Contracts";

export interface IDynamicModuleLoaderProps {
    /** Modules that need to be dynamically registerd */
    modules: IModuleTuple;

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
                    createStore={this.props.createStore}
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

interface IDynamicModuleLoaderImplState {
    readyToRender: boolean;
}

class DynamicModuleLoaderImpl extends React.Component<
    IDynamicModuleLoaderImplProps,
    IDynamicModuleLoaderImplState
> {
    private _addedModules?: IDynamicallyAddedModule;
    private _providerInitializationNeeded: boolean = false;
    private _store: IModuleStore<any>;
    private _getLatestState: boolean;

    constructor(props: IDynamicModuleLoaderImplProps) {
        super(props);
        this.state = { readyToRender: false };
        this._store = this.props.store;
    }

    private _renderWithReactReduxContext = () => {
        const { store } = this.props;
        // store.getState is important here as we don't want to use storeState from the provided context
        return (
            <ReactReduxContext.Provider
                value={{ store, storeState: store.getState() }}>
                {this._renderChildren()}
            </ReactReduxContext.Provider>
        );
    };

    private _renderChildren = () => {
        if (this.props.children && typeof this.props.children === "function") {
            return this.props.children();
        }

        return this.props.children;
    };

    public render(): React.ReactNode {
        if (this.state.readyToRender) {
            if (this._providerInitializationNeeded) {
                return (
                    <Provider store={this._store}>
                        {this._renderChildren()}
                    </Provider>
                );
            } else if (!this._getLatestState) {
                return this._renderChildren();
            }

            this._getLatestState = false;
            return this._renderWithReactReduxContext();
        }
        return null;
    }

    public componentDidMount() {
        const { createStore, modules } = this.props;
        if (!this._store) {
            if (createStore) {
                this._store = createStore();
                this._providerInitializationNeeded = true;
            } else {
                throw new Error(
                    "Store could not be resolved from React context"
                );
            }
        } else {
            // We will add modules dynamically and due to github issue https://github.com/Microsoft/redux-dynamic-modules/issues/27#issuecomment-464905893
            // The very first render will not get latest state, to fix that we will need to get latest state from store directly on first render
            this._getLatestState = ReactReduxContext;
        }

        this._addedModules = this._store.addModules(modules);

        this.setState({ readyToRender: true });
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
