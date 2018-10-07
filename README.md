<div>
<img src="docs/redux-dynamic-modules.png" alt="logo" width="100">
</img>
<h1>Redux Dynamic Modules</h1<
</div>

## What is it?
**redux-dynamic-modules** is a library that aims to make Redux Reducers easy to modularize and add/remove dynamically. 

## Motivation
In large React/Redux applications, oftentimes you will have portions of your state that serve distinct purposes. For example, you might have a reducer and saga that manages `LoginState` in your application, or another set that manages `Todos`. These can be split up into a `LoginModule` and a `TodoModule`. 

Modules provide the following benefits:
* They can be easily re-used across the application, or between multiple similar applications.
* They can be added/removed from the store dynamically, ex. when a component mounts or when a user performs an action

## Features
* Group together reducers, middleware, and state into a single, re-usable module.
* Add and remove modules from a Redux store at any time.
* Use the included `<DynamicModuleLoader />` component to automatically add a module when a component is rendered
* Extensions provide integration with popular libraries, including `redux-saga` and `redux-observable`
  
## Install
Run 
```
npm install redux-dynamic-modules
```

or 
```
yarn add redux-dynamic-modules
```

## Usage
* Create a module with the following format

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

* Create a `ModuleStore`

```typescript
import {configureStore, IModuleStore} from "redux-dynamic-modules";
import {getUsersModule} from "./usersModule";

const store: IModuleStore<IState> = configureStore(
  /* initial state */
  {},

  /* redux-saga context */ 
  {},

  getUsersModule(), 
  /* ...any additional modules */
);
```

*  Use like a standard Redux store
* Use the `DynamicModuleLoader` React component to add/remove modules when components mount/unmount

```jsx
<DynamicModuleLoader reduxModules={modules}>
   <div>Hello World!!</div>
</DynamicModuleLoader>
``` 

## Examples
See the [Todo App](https://github.com/Microsoft/redux-dynamic-modules/tree/master/packages/todo-example) for a quick of example of the library in practice.

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
