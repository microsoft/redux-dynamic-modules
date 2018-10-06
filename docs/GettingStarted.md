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
1. Create a module with the following format
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

2. Create a `ModuleStore`
```typescript
const store: IModuleStore<IState> = configureStore(
  /* initial state */
  {},

  /* redux-saga context */ 
  {},

  getUsersModule(), 
  /* ...any additional modules */
);
```

3. Use like a standard Redux store
4. Use the `DynamicModuleLoader` React component to add/remove modules when components mount/unmount
```jsx
<DynamicModuleLoader modules={modules}>
   <div>Hello World!!</div>
</DynamicModuleLoader>
``` 