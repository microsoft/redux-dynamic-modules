# Module

A 'module' consists of the following properties

-   `id`: A unique ID to identify this module
-   `reducerMap`: The reducers that this module will register
-   `initialActions`: Any optional actions to fire when this module is added
-   `finalActions`: Any optional actions to fire when this module is removed.

An example module definition looks like the following:

```typescript
export function getUsersModule(): IModule<IUserState> {
    return {
        id: "todo-module",
        reducerMap: {
            todoState: todoReducer,
        },
        initialActions: [TodoActions.initializeTodos()],
        finalActions: [TodoActions.disposeTodos()],
    };
}
```

In the above example, the key `todoState` will be added to the Redux store along with the `todoReducer`. Note that you can use `combineReducers` here to allow for more nested state.
