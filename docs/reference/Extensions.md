# Extensions
`redux-dynamic-modules` supports the concept of extensions, which allow for custom behavior when adding/removing modules. 
The `redux-dynamic-modules-saga` and `redux-dynamic-modules-thunk` packages are built as extensions.

## Building a custom extension
To build a custom extension, create an object that implements the following interface

```typescript
export interface IExtension {
    /** Specifies any middlware that should be added to the store that supports this plugin */
    middleware?: Middleware[];
    /** Called when the module store is created. The module manager can be used to add/remove modules */
    onModuleManagerCreated?: (moduleManager: IModuleManager) => void;
    /** Called when a module is added */
    onModuleAdded?: (module: IModule<any>) => void;
    /** Called when a module is removed */
    onModuleRemoved?: (module: IModule<any>) => void;
    /** Called when the store is disposed */
    dispose?: () => void;
}
```

## Adding extensions to the store
To add an extension to the `ModuleStore`, pass it as the second argument to `createStore`
```typescript
const store: IModuleStore<IState> = createStore({}, [], [getMyExtension()])
```


## Example
```typescript
//LoggingExtension.ts

export function getLoggingExtension(): IExtension {
    return {
        onModuleAdded: (module: IModule<any>) => console.log(`Module ${module.id} added`),
        onModuleRemoved: (module: IModule<any>) => console.log(`Module ${module.id} removed`),
    }
}
```