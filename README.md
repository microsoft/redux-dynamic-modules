<div>
<img src="docs/redux-dynamic-modules.png" alt="logo" width="100">
</img>
<h1>Redux Dynamic Modules</h1<
</div>

[![Pipelines](https://dev.azure.com/redux-dynamic-modules/redux-dynamic-modules/_apis/build/status/Microsoft.redux-dynamic-modules?branchName=master)](https://dev.azure.com/redux-dynamic-modules/redux-dynamic-modules/redux-dynamic-modules%20Team/_build?definitionId=1&_a=summary) [![npm (scoped)](https://img.shields.io/npm/v/redux-dynamic-modules.svg)](https://npmjs.org/package/redux-dynamic-modules) [![Join the chat at https://gitter.im/redux-dynamic-modules/community](https://badges.gitter.im/redux-dynamic-modules/community.svg)](https://gitter.im/redux-dynamic-modules/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) ![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)

## What is it?

**redux-dynamic-modules** is a library that aims to make Redux Reducers and middleware easy to modular-ize and add/remove dynamically.

## Motivation

In large Javascript applications, it is often desired to perform some kind of code-splitting, so that the initial script size is small. However, in Redux, you are required to define your reducers and middleware up-front; there is no good way to dynamically add/remove these constructs at runtime.

**redux-dynamic-modules** is designed to make dynamically loading these constructs easier. You can define a **module**, which contains reducers and middleware, and add it to the Redux store at runtime. We also provide a React component `DynamicModuleLoader`, which can load/unload modules on mount/unmount.

Modules provide the following benefits:

-   Modules can be easily re-used across the application, or between multiple similar applications.
-   Components declare the modules needed by them and redux-dynamic-modules ensures that the module is loaded for the component.
-   Modules can be added/removed from the store dynamically, ex. when a component mounts or when a user performs an action

## Features

-   Group together reducers, middleware, and state into a single, re-usable module.
-   Add and remove modules from a Redux store at any time.
-   Use the included `<DynamicModuleLoader />` component to automatically add a module when a component is rendered
-   Extensions provide integration with popular libraries, including `redux-saga` and `redux-thunk`

## Example Scenarios

-   You don't want to load the code for all your reducers up front. Define a module for some reducers and use `DynamicModuleLoader` and a library like [react-loadable](https://github.com/jamiebuilds/react-loadable) to download and add your module at runtime.
-   You have some common reducers/middleware that need to be re-used in different areas of your application. Define a module and easily include it in those areas.
-   You have a mono-repo that contains multiple applications which share similar state. Create a package containing some modules and re-use them across your applications

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

-   Create a module with the following format

```typescript
export function getUsersModule(): IModule<IUserState> {
    return {
        id: "users",
        reducerMap: {
            users: usersReducer,
        },
        // Actions to fire when this module is added/removed
        // initialActions: [],
        // finalActions: []
    };
}
```

-   Create a `ModuleStore`

```typescript
import { createStore, IModuleStore } from "redux-dynamic-modules";
import { getUsersModule } from "./usersModule";

const store: IModuleStore<IState> = createStore({
      initialState: { /** initial state */ },
      enhancers: [ /** enhancers to include */ ], 
      extensions: [/** extensions to include i.e. getSagaExtension(), getThunkExtension() */],
},
    getUsersModule()
    /* ...any additional modules */
);
```

-   Use like a standard Redux store
-   Use the `DynamicModuleLoader` React component to add/remove modules when components mount/unmount

```jsx
<DynamicModuleLoader modules={[getHelloWorldModule()]}>
    <div>Hello World!!</div>
</DynamicModuleLoader>
```
```typescript
export interface IDynamicModuleLoaderProps {
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
```

## Extensions

-   redux-saga - [redux-dynamic-modules-saga](https://www.npmjs.com/package/redux-dynamic-modules-saga)
-   redux-thunk - [redux-dynamic-modules-thunk](https://www.npmjs.com/package/redux-dynamic-modules-thunk)

## Examples

See the [Widgets](https://github.com/Microsoft/redux-dynamic-modules/tree/master/packages/widgets-example) for a quick of example of the library in practice.

Step by step walthrough of start consuming `redux-dynamic-modules` in the widget app. [Youtube](https://www.youtube.com/watch?v=SktRbSZ-4Tk)

## Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
