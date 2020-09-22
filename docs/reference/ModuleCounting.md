# Module Reference Counting

**redux-dynamic-modules** will automatically perform "reference counting" of your modules and their contents.

## For Modules

The library will reference count entire modules. This means:

-   If you add a module, adding it again is a NO-OP
-   If you add a module twice, it must be removed twice.

Consider the following example:

```jsx
export function createModuleA() {
    return {
        id: "a"
        reducerMap: {"aState": aReducer}
    }
}

// ComponentA.jsx
render() {
    return (
        <DynamicModuleLoader reduxModules={createModuleA()} />
    );
}

// ComponentAPrime.jsx
render() {
    return (
        <div>
            Slightly different component
            <DynamicModuleLoader reduxModules={createModuleA()} />
        </div>
    );
}

// Host.jsx
render() {
    return (
        <div>
            // Both this.state.showComponentA and this.state.showComponentAPrime must be false for 'module A' to be removed
            {this.state.showComponentA && <ComponentA />}
            {this.state.showComponentAPrime && <ComponentAPrime />}
        </div>
    )
}
```

## For Module Contents

The library will also reference count the contents of your modules, including reducers and middleware. This means:

-   If two different modules add the same middleware, only one copy of the middleware is added. Only until **both** modules are removed will the middleware be removed

```jsx
export function createModuleA() {
    return {
        id: "a"
        middlewares: [getLoggingMiddleware()]
    }
}

export function createModuleB() {
    return {
        id: "b"
        middlewares: [getLoggingMiddleware()],
        reducerMap: {b: bReducer}
    }
}

let removeA = moduleStore.addModule(createModuleA()); // LoggingMiddleware is added
let removeB = moduleStore.addModule(createModuleB()); // No additional middleware is added
removeA(); // LoggingMiddleware is still enabled, because it is ref counted
removeB(); // LoggingMiddleware is removed

```

-   If two different modules add a reducer with the same key, only the first added reducer will be used.
    For this reason, **it is recommended to keep state keys unique where possible.**

```jsx
export function createModuleA() {
    return {
        id: "a"
        reducerMap: {a: reducerA}
    }
}

export function createModuleB() {
    return {
        id: "b"
        reducerMap: {a: aDifferentReducerA}
    }
}

let removeA = moduleStore.addModule(createModuleA()); // ReducerA is added under "a"
let removeB = moduleStore.addModule(createModuleB()); // ADifferentReducerA is not added, "a" is still using ReducerA
removeA(); // ReducerA is not removed, "a" is still using ReducerA
removeB(); // ReducerA is removed, "a" is removed from the state

```

The `redux-dynamic-modules-saga` package also performs this kind of ref counting for sagas.
