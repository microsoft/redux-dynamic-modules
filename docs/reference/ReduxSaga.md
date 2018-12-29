## Usage with redux-saga

You can use `redux-dynamic-modules` alongside `redux-saga` so that you can add/remove sagas along with your modules.

To use

-   `npm install redux-dynamic-modules-saga`
-   Add the saga extension to the `createStore` call

```typescript
import { createStore, IModuleStore } from "redux-dynamic-modules";
import { getSagaExtension } from "redux-dynamic-modules-saga";
import { getUsersModule } from "./usersModule";

const store: IModuleStore<IState> = createStore(
    /* initial state */
    {},

    /** enhancers **/
    [],

    /* Extensions to load */
    [getSagaExtension({} /* saga context */)],

    getUsersModule()
    /* ...any additional modules */
);
```

-   Add the `sagas` property to your modules, and specify a list of sagas to run

```typescript
return {
    id: "users-module",
    reducerMap: {
        users: usersReducer,
    },
    sagas: [
        usersSaga,
        { saga: usersSagaWithArguments, argument: { a: "argument" } },
    ],
};
```
