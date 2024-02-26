import * as React from "react";
//@ts-ignore // ReactReduxContext is not officially exported
import { Provider, ReactReduxContext } from "react-redux";

import {
    IDynamicallyAddedModule,
    IModuleStore,
    IModuleTuple,
} from "redux-dynamic-modules-core";

export interface IDynamicModuleLoaderProps {
    /** Explicitly name children as a prop to work with @types/react@18 */
    children: React.ReactNode;
    /** Modules that need to be dynamically registerd */
    modules: IModuleTuple;

    /**
     * Set this flag to indicate that this component is being rendered in 'Strict Mode'
     * React 'StrictMode' does not allow constructor side-effects, so we defer adding modules to componentDidMount
     * when this flag is set.
     * This has the effect of adding a second render.
     */
    strictMode?: boolean;

    /** Optional callback which returns a store instance. This would be called if no store could be loaded from th  e context. */
    createStore?: () => IModuleStore<any>;
}

/**
 * The DynamicModuleLoader adds a way to register a module on mount
 * When this component is initialized, the reducer and saga from the module passed as props will be registered with the system
 * On unmount, they will be unregistered
 */
export class DynamicModuleLoader extends React.Component<
    IDynamicModuleLoaderProps
> {
    public render() {
        return (
            <ReactReduxContext.Consumer>
                {reactReduxContext => (
                    <DynamicModuleLoaderImpl
                        {...this.props}
                        reactReduxContext={reactReduxContext}
                    />
                )}
            </ReactReduxContext.Consumer>
        );
    }
}

interface IDynamicModuleLoaderImplProps extends IDynamicModuleLoaderProps {
    /** The react-redux context passed from the <Provider> component */
    reactReduxContext?: { store: IModuleStore<any> };
}

interface IDynamicModuleLoaderImplState {
    /** Is the DML component ready to render.
     * If strictMode is set to false, this will be set to true initially
     * If strict mode is set to true, this will be set after the first render completes
     */
    readyToRender: boolean;
}

class DynamicModuleLoaderImpl extends React.Component<
    IDynamicModuleLoaderImplProps,
    IDynamicModuleLoaderImplState
> {
    /** The modules that were added from this loader */
    private _addedModules?: IDynamicallyAddedModule;
    /** Flag that indicates we need to create a store/provider because a parent store was not provided */
    private _providerInitializationNeeded: boolean = false;
    /** The module store, derived from context */
    private _store: IModuleStore<any>;

    constructor(props: IDynamicModuleLoaderImplProps) {
        super(props);

        if (props.reactReduxContext == null) {
            const message =
                "Tried to render DynamicModuleLoader, but no ReactReduxContext was provided";
            console.error(message);

            throw new Error(message);
        }

        this._store = props.reactReduxContext
            ? props.reactReduxContext.store
            : undefined;

        // We are not in strict mode, let's add the modules ASAP
        if (!this.props.strictMode) {
            this._addModules();
            this.state = { readyToRender: true };
        } else {
            // We are in strict mode, so have to wait for CDM to add modules.
            // Thus, we cannot render the children at this time
            this.state = { readyToRender: false };
        }
    }

    public render(): React.ReactNode {
        if (this.state.readyToRender) {
            if (this._providerInitializationNeeded) {
                return (
                    <Provider store={this._store}>
                        {/* We just rendered the provider, so now we need to render
                        DML again. This one will add the modules */}
                        <DynamicModuleLoader {...this.props} />
                    </Provider>
                );
            }

            return (
                <>
                    {this._renderLoader()}
                    <AddedModulesCleanup cleanup={this._cleanup} />
                </>
            );
        }

        return null;
    }

    /**
     * Render a Redux provider
     */
    private _renderLoader(): React.ReactNode {
        return this.props.children
            ? typeof this.props.children === "function"
                ? this.props.children()
                : this.props.children
            : null;
    }

    private _addModules(): void {
        const { createStore, modules } = this.props;

        if (!this._store) {
            // If we need to create a store, do that here. We will skip adding the modules and render DML again
            if (createStore) {
                this._store = createStore();
                this._providerInitializationNeeded = true;
            } else {
                throw new Error(
                    "Store could not be resolved from React context"
                );
            }
        } else {
            // Add the modules here
            this._addedModules = this._store.addModules(modules);
        }
    }

    public componentDidMount() {
        if (this.props.strictMode) {
            this._addModules();
            this.setState({ readyToRender: true });
        }
    }

    /**
     * Unregister sagas and reducers
     */
    private _cleanup = () => {
        if (this._addedModules) {
            this._addedModules.remove();
            this._addedModules = undefined;
        }
    }
}

interface IAddedModulesCleanupProps {
    cleanup: () => any;
}

/**
 * This component is rendered as the last child of DynamicModuleLoaderImpl
 * so react runs willUnmount on connected(react-redux) children before this
 * cleanup and allows them to unsubscribe from store before dynamic reducers
 * removing (and avoid errors in selectors)
 */
class AddedModulesCleanup extends React.Component<IAddedModulesCleanupProps> {

    public render() {
        return null;
    }

    public componentWillUnmount() {
        this.props.cleanup();
    }
}
