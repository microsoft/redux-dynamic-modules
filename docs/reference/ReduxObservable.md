## Usage with redux-observable

You can use `redux-dynamic-modules` alongside `redux-observable` so that you can add/remove Epics along with your modules.

To use

-   `npm install redux-dynamic-modules-observable`
-   Add the observable extension to the `createStore` call

```typescript
import { createStore, IModuleStore } from "redux-dynamic-modules";
import { getObservableExtension } from "redux-dynamic-modules-observable";
import { getUsersModule } from "./usersModule";

const store: IModuleStore<IState> = createStore(
    /* initial state */
    {},

    /** enhancers **/
    [],

    /* Extensions to load */
    [getObservableExtension()],

    getUsersModule()
    /* ...any additional modules */
);
```

-   Add the `epics` property to your modules, and specify a list of observables to run

```typescript
return {
    id: "users-module",
    reducerMap: {
        users: usersReducer,
    },
    epics: [usersEpic],
};
```
