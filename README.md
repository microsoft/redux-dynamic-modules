<div>
<img src="docs/redux-dynamic-modules.png" alt="logo" width="100">
</img>
<h1>Redux Dynamic Modules</h1<
</div>

## What is it?
**redux-dynamic-modules** is a library that aims to make Redux Reducers and middleware easy to modularize and add/remove dynamically. 

## Motivation
In React applications, modules containing components can be loaded dynamically when required, this makes the intial set of scripts to minimum and not include unwanted scripts in primary bundles. We can use [react-loadable](https://github.com/jamiebuilds/react-loadable) to load the scripts when needed.

Redux requires defining the reduer map while defining the store, there is no easy way to load/unload reducers, action creators, selectors and middleware, when the components needed them are mounted and unmounted. 

**redux-dynamic-modules** helps in these scenario, consider it as a redux counterpart of [react-loadable](https://github.com/jamiebuilds/react-loadable). 

You can define a module with a unique id, reducer map and optional middleware and wrap the component in a HOC (`<DynamicModuleLoader />`).
When the React component is mounted the reducer and middleware will be dynamically added to the store, and on component unmount they will be cleanup. See the widgets-example for reference.

Modules provide the following benefits:
* They can be easily re-used across the application, or between multiple similar applications.
* Components declare the modules needed by them and redux-dynamic-modules ensures that the module is loaded for the component. 
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
See the [Widgets](https://github.com/Microsoft/redux-dynamic-modules/tree/master/packages/widgets-example) for a quick of example of the library in practice.

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
