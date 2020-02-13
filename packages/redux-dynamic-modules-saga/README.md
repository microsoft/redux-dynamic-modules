## Install

Run

```
npm install redux-dynamic-modules-saga
```

or

```
yarn add redux-dynamic-modules-saga
```

## Usage

-   Create a module with the following format

```typescript
export function getUsersModule(): ISagaModule<IUserState> {
    return {
        id: "users",
        reducerMap: {
            users: usersReducer,
        },
        sagas: [userSagas],
        // Actions to fire when this module is added/removed
        // initialActions: [],
        // finalActions: [],
    };
}
```

-   Create a `ModuleStore`

```typescript
import { createStore, IModuleStore } from "redux-dynamic-modules";
import { getSagaExtension } from "redux-dynamic-modules-saga";
import { getUsersModule } from "./usersModule";

const store: IModuleStore<IState> = createStore(
  {
    initialState: {},
    enhancers: [],
    extensions: [getSagaExtension({} /* saga context */)],
  },
  getUsersModule()
  /* ...any additional modules */
);
```
