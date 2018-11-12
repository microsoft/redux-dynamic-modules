import * as React from "react";
import * as PropTypes from "prop-types";
import {
  IModule,
  IModuleStore,
  IDynamicallyAddedModule
} from "./Contracts";

// Import ReactReduxContext from react-redux. If react-redux is less than version 6, ReactReduxContext will be null.
import { ReactReduxContext } from "react-redux";

export interface IDynamicModuleLoaderProps<OriginalState, AdditionalState> {
  /** Modules that need to be dynamically registerd */
  modules: IModule<AdditionalState>[];
}

// Use for version 5 and below
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
  >
{
  // Version 5 and below
  private static contextTypes = {
    store: PropTypes.object
  };

  constructor(
    props: IDynamicModuleLoaderProps<OriginalState, AdditionalState>,
    context: IDynamicModuleLoaderContext
  ) {
    super(props, context);
    if (!ReactReduxContext) {
      if (!context.store) {
        throw new Error("Could not load store from React context.");
      }
    }
  }

  /**
   * Render a Redux provider
   */
  public render(): React.ReactNode {
    if (ReactReduxContext) {
      return (
        <ReactReduxContext.Consumer>
          {(context) => {
            if (!context.store) {
              throw new Error("Could not load store from React context.");
            }

            return (
              <DynamicModuleLoaderImpl
                store={context.store}
                modules={this.props.modules}
              />
            );
          }}
        </ReactReduxContext.Consumer>
      );
    } else {
      return (
        <DynamicModuleLoaderImpl
          // @ts-ignore
          store={this.context.store}
          modules={this.props.modules}
        />
      )
    }
  }
}


interface IDynamicModuleLoaderImplProps {
  /** Modules that need to be dynamically registerd */
  modules: IModule<any>[];

  store: IModuleStore<any>;
}

class DynamicModuleLoaderImpl extends React.Component<IDynamicModuleLoaderImplProps> {
  private _addedModules?: IDynamicallyAddedModule;

  constructor(props: IDynamicModuleLoaderImplProps) {
    super(props);
    const { modules, store } = props;
    this._addedModules = store.addModules(modules);
  }

  public render(): React.ReactNode {
    return this.props.children;
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
