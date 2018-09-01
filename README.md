Many a times in a React app some Components are mounted on user action and then are unmounted later on.

These Component may contain some redux artifacts e.g. reducers and sagas that are used only for the Component and then are not useful when such Component is unmounted.

react-redux-modules allows "packaging" such artifacts in a module that can be added/removed to the store dynamically.

These modules are also useful for sharing a reusable set of functionality with other part of the apps.
 

**Module**

A module is a represented by following interface. 

```
/**
 * Represents a module which is set of reducers, sagas, inital actions and final actions
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
   * These sagas are executed immediatly after adding the module to the store (before dispatching initial actions)
   */
  sagas?: ISagaRegistration<any>[];

  /**
   * These actions are dispatched immediatly after adding the module in the store
   */
  initialActions?: AnyAction[];

  /**
   * These actions are dispatched immediatly before removing the module from the store
   */
  finalActions?: AnyAction[];
}
```

**Module Store**

Instead of using the redux Store interface you need to use IModuleStore, which extends redux store and provides additional functions to add/remove modules on demand.

```
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

export interface IDynamicallyAddedModule {
  /**
   * Call to remove the module from the store
   */
  remove: () => void;
}
```

**Provider**

This package comes with a configureStore that has interface similar to redux's out of the box configureStore but allows module support. This store can be provided to ```<Provider store={moduleStore}/>``` in react-redux.

```
export function configureStore<SagaContext, State>(
    initialState: DeepPartial<State>, 
    context: SagaContext, 
    ...initialModules: IModule<any>[]): IModuleStore<State> {
        ...
        ...
    }
```

**Dynamic Module Loader**

This package also comes with a HOC, than can be used to dynamically add a module. The dynamic module loader gets the store from react context.
```
<DynamicModuleLoader modules={modules}>
   <div>Hello World!!</div>
</DynamicModuleLoader>
``` 


# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.