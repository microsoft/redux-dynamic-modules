# Typescript
`redux-dynamic-modules` is written natively in Typescript and contains types to help you typecheck your module definitions. In this document, we outline some common strategies we use when typing/defining modules.

## Defining a module's state

A module may contribute one or more reducers and keys to the Redux store. Consider the following module definition which adds two keys/reducers

```js
const TodoModule = {
    id: "todo-module",
    reducerMap: {
        todoState: todoReducer,
        todoDialogState: todoDialogReducer,
    },
};
```

`redux-dynamic-modules` provides types to help define this module more accurately. To leverage them, you must define a type which represents the **slice** of state that your module will contribute to the store. For the above example, we could define the following state

```ts
export interface ITodoModuleOwnState {
    todoState: ITodoState;
    todoDialogState: ITodoDialogState;
}

export interface ITodoState {
    // add your state contents here
}

export interface ITodoDialogState {
    // add your state contents here
}
```

The `ITodoModuleOwnState` type defines the two keys that are added by the `TodoModule`. The types of the keys (`ITodoState` and `ITodoDialogState`) are used by the reducers that should be attached to them.

```ts
export function todoReducer(state: ITodoState, action): ITodoState {
    //reducer implementation
}

export function todoDialogReducer(
    state: ITodoDialogState,
    action
): ITodoDialogState {
    //reducer implementation
}
```

Finally, we can leverage this type in our module definition as follows:

```ts
import { IModule } from "redux-dynamic-modules";

export const TodoModule: IModule<ITodoModuleOwnState> = {
    id: "todo-module",
    reducerMap: {
        todoState: todoReducer,
        todoDialogState: todoDialogReducer,
    },
};
```

Now, our TodoModule expects two reducers with keys that match those in `ITodoModuleOwnState`. The module will fail to compile if the `reducerMap` property is missing keys that are defined in `ITodoModuleOwnState`, or if the reducer functions assigned to the keys accept state arguments that are different than those defined.

## Typing Module Dependencies

In a previous section [Module Dependencies](reference/Dependencies.md), we showed that you can express a dependency between two modules.

```js
export const ModuleB = [
    ModuleA,
    {
        id: "module-b",
        reducerMap: {...}
    }
]
```

When defining modules in the above fashion, we lose some of the type-checking that Typescript gives us. This is because we defined the modules 'in-line', so the compiler has no idea what state to typecheck against. For this reason, we reccomend defining individual modules separately with a type annotation, and then including it in a dependency array. For example:

```js
const _moduleB: IModule<IModuleBOwnState> = {
    id: "module-b",
    reducerMap: {...}
};

export const ModuleB = [
    ModuleA,
    _moduleB
];
```

With this approach, you get typechecking on the individual modules.

## Typing state in selector functions

One core concept of Redux is the ['selector function'](https://redux.js.org/recipes/computing-derived-data). Selector functions take the Redux state and obtain specific information from it.

When writing your module, you may wish to write selector functions that are scoped to the state that the module knows about. For example, lets consider we want to write a selector function for the `ModuleC` we defined above. Because `ModuleC` takes a dependency on `ModuleB`, our selector function may also want to access data from the state contributed by `ModuleB`.

To express this, we define a new type, `IModuleCAwareState`.

```js
export interface IModuleCAwareState
    extends IModuleCOwnState,
        IModuleBAwareState {}

// moduleCSelectors.js
export function moduleCSelector(state: IModuleCAwareState) {
    // access keys contributed by modules B and C
}
```

The `IModuleCAwareState` type is a type that represents the subset of keys that should be present in the store if `ModuleC` is added to the store. Therefore, any selector that is written with `ModuleC` can access all of the keys defined in `IModuleCAwareState`. This pattern allows you to write selectors that are encapsulated to the module and can only access state present if the module is added.
