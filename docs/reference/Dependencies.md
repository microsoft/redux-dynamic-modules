# Module Dependencies

Sometimes, a module depends on other modules. This means that a module requires dependent modules be already loaded in the store before it is loaded.

Consider that we have `ModuleA` and `ModuleB`, where `ModuleB` requires that `ModuleA` be loaded first. We can express that dependency using an array as follows:

```js
export const ModuleB = [
    ModuleA,
    {
        id: "module-b",
        reducerMap: {...}
    }
]
```

Now when adding `ModuleB` to the store via `DynamicModuleLoader`, we are guaranteed that `ModuleA` will be loaded first, which satisfies `ModuleB's` requirements.

We can also express nested dependencies. For example:

```js
export const ModuleC = [
    ModuleB,
    {
        id: "module-c",
        reducerMap: {...}
    }
]
```

`redux-dynamic-modules` will automatically flatten the array and load the dependencies in order.
