# Redux Dynamic Modules
**redux-dynamic-modules** is a library that aims to make Redux Reducers and Sagas easy to modularize and add/remove dynamically. 

## Motivation
In large React/Redux applications, oftentimes you will have portions of your state that serve distinct purposes. For example, you might have a reducer and saga that manages `Users` in your application, or another set that manages `Todos`. These can be split up into a `UserModule` and a `TodoModule`. 

Modules provide the following benefits:
* They can be easily re-used across the application, or between multiple similar applications.
* They can be added/removed from the store dynamically, ex. when a component mounts or when a user performs and action

# Getting Started
## Install
Run 
```
npm install redux-dynamic-modules
```

or 
```
yarn add redux-dynamic-modules
```

## Usage Example
1. Create a module with the following format
```typescript
export function getUsersModule(): IModule<IUserState> {
  return {
    id: "users",
    reducerMap: {
      users: usersReducer
    },
    sagas: [usersSaga],

    // Actions to fire when this module is added/removed
    // initialActions: [],
    // finalActions: []
  }
}

```

2. Create a `ModuleStore`
```typescript
const store: IModuleStore<IState> = configureStore(
  /* initial state */
  null,

  /* redux-saga context */ 
  {},

  getUsersModule(), 
  /* ...any additional modules */
);
```

3. Use like a standard Redux store
4. Use the `DynamicModuleLoader` React component to add/remove modules when components mount/unmount
```jsx
<DynamicModuleLoader modules={modules}>
   <div>Hello World!!</div>
</DynamicModuleLoader>
``` 

# Documentation

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
