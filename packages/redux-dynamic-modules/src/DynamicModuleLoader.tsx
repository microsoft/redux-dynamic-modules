import * as React from "react";
import * as PropTypes from "prop-types";
import { IModule, IModuleStore, IDynamicallyAddedModule } from "./Contracts";
import { Provider } from "react-redux";

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
  private _addedModules?: IDynamicallyAddedModule;
  private _store: IModuleStore<any>;
  private _providerInitializationNeeded: boolean;

  // @ts-ignore
  private static contextTypes = {
    store: PropTypes.object
  };

  constructor(
    props: IDynamicModuleLoaderProps<OriginalState, AdditionalState>,
    context: IDynamicModuleLoaderContext
  ) {
    super(props, context);
    const { modules, createStore } = props;
    this._store = context.store;
    this._providerInitializationNeeded = false;

    if (!this._store) {
      if (createStore) {
        this._store = createStore();
        this._providerInitializationNeeded = true;
      } else {
        throw new Error("Could not load store from React context.");
      }
    }

    this._addedModules = this._store.addModules(modules);
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

  /**
   * Render a Redux provider
   */
  public render(): React.ReactNode {
    if (this._providerInitializationNeeded) {
      return <Provider store={this._store}>{this.props.children}</Provider>;
    } else {
      return this.props.children;
    }
  }
}
