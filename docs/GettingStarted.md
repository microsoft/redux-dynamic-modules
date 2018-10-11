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
* Create a module with the following format

```typescript
export function getUsersModule(): IModule<IUserState> {
  return {
    id: "users",
    reducerMap: {
      users: usersReducer
    },
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
<DynamicModuleLoader modules={modules}>
   <div>Hello World!!</div>
</DynamicModuleLoader>
``` 