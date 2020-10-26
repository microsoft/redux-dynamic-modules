# Module Store

The **Module Store** is a Redux store with the added capability of managing **Redux Modules**. It adds the following additional functions to the basic Redux store.

-   `addModule(module: IModule<any>)`: Add a single module to the store. The return result is a function that can be used to remove the added module
-   `addModules(modules: IModule<any>[])`: Same as `addModule`, but for multiple modules. The return function will remove all the added modules.
-   `dispose()`: Remove all of the modules added to the store and dispose of the object

To create a `ModuleStore`, use the `createStore` function from our package

## Example {docsify-ignore}

```typescript
import { createStore, IModuleStore } from "redux-dynamic-modules";
import { UsersModule } from "./usersModule";

const store: IModuleStore<IState> = createStore(
    {
        initialState: {},
        //extensions: [],
        //enhancers: [],
        //advancedCombineReducers: null
    },
    UsersModule
    /* ...any additional modules */
);
```

## Advanced Usage

You can pass additional properties to `createStore` to further customize its usage

-   `extensions: IExtension[]`: Any extensions you want to run along with the store. See [Extensions](reference/Extensions.md) for more info.
-   `enhancers: Enhancer[]`: Any Redux enhancers you want to add. These will automatically be composed together.
-   `advancedCombineReducers`: Provide a custom implementation of `combineReducers`, which can be helpful for working with libraries like ImmutableJS. [See Here](https://github.com/gajus/redux-immutable)
-   `advancedComposeEnhancers`: Override enhancer composition. Check out [Redux Devtools Extension](reference/Devtools.md) for a sample usage.
