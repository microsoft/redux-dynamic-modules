# Install

Run

```
npm install redux-dynamic-modules
```

or

```
yarn add redux-dynamic-modules
```

# Usage

-   Create a module with the following format

```typescript
export const UsersModule: IModule<IUserState> = {
    id: "users",
    reducerMap: {
        users: usersReducer,
    },
    // Actions to fire when this module is added/removed
    // initialActions: [],
    // finalActions: []
};
```

-   Create a `ModuleStore`

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

-   Use like a standard Redux store
-   Use the `DynamicModuleLoader` React component to add/remove modules when components mount/unmount

```jsx
<DynamicModuleLoader modules={modules}>
    <div>Hello World!!</div>
</DynamicModuleLoader>
```
