import * as React from "react";
import * as PropTypes from "prop-types";
import {
  IModule,
  IModuleStore,
  IDynamicallyAddedModule
} from "./Contracts";

export interface IDynamicModuleLoaderProps<OriginalState, AdditionalState> {
  /** Modules that need to be dynamically registerd */
  modules: IModule<AdditionalState>[];
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

  // @ts-ignore 
  private static contextTypes = {
    store: PropTypes.object
  };

  constructor(
    props: IDynamicModuleLoaderProps<OriginalState, AdditionalState>,
    context: IDynamicModuleLoaderContext
  ) {
    super(props, context);
    const { modules } = props;
    const store: IModuleStore<any> = context.store;
    if (!store) {
      throw new Error("Could not load store from React context.");
    }
    this._addedModules = store.addModules(modules);
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
    return this.props.children;
  }
}
