#Typescript
`redux-dynamic-modules` is written natively in Typescript and contains types to help you typecheck your module definitions. In this document, we outline some common strategies we use when typing/defining modules.

## Defining a module's state
A module may contribute one or more reducers and keys to the Redux store. Consider the following module definition which adds two keys/reducers

```js
const TodoModule = {
    id: "todo-module",
    reducerMap: {
        todoState: todoReducer,
        todoDialogState: todoDialogReducer
    }
}
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

export function todoDialogReducer(state: ITodoDialogState, action): ITodoDialogState {
    //reducer implementation
}

```
Finally, we can leverage this type in our module definition as follows:

```ts
import {IModule} from "redux-dynamic-modules"

export const TodoModule: IModule<ITodoModuleOwnState> = {
    id: "todo-module",
    reducerMap: {
        todoState: todoReducer,
        todoDialogState: todoDialogReducer
    }
};
```

Now, our TodoModule expects two reducers with keys that match those in `ITodoModuleOwnState`. The module will fail to compile if the `reducerMap` property is missing keys that are defined in `ITodoModuleOwnState`, or if the reducer functions assigned to the keys accept state arguments that are different than those defined.

## Module Dependencies

## Typing state in selector functions

## 'Aware' state definitions