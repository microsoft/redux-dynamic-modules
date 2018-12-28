# Module Store

The **Module Store** is a Redux store with the added capability of managing **Redux Modules**. It adds the following additional functions to the basic Redux store.

-   `addModule(module: IModule<any>)`: Add a single module to the store. The return result is a function that can be used to remove the added module
-   `addModules(modules: IModule<any>[])`: Same as `addModule`, but for multiple modules. The return function will remove all the added modules.
-   `dispose()`: Remove all of the modules added to the store and dispose of the object

To create a `ModuleStore`, use the `createStore` function from our package

## Example {docsify-ignore}

```typescript
import { createStore, IModuleStore } from "redux-dynamic-modules";
import { getUsersModule } from "./usersModule";

const store: IModuleStore<IState> = createStore(
    /* initial state */
    {},

    /** enhancers **/
    [],

    /* Extensions to load */
    [],

    getUsersModule()
    /* ...any additional modules */
);
```
