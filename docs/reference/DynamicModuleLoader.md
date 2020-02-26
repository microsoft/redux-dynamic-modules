# Dynamic Module Loader

`redux-dynamic-modules` provides a `DynamicModuleLoader` React component, which allows you to add/remove modules when a component is rendered.

## Example {docsify-ignore}

```typescript
import { DynamicModuleLoader } from "redux-dynamic-modules";
import { getNewUserDialogModule } from "./newUserDialogModule";

export class NewUserDialog extends React.Component {
    public render() {
        return (
            <DynamicModuleLoader modules={[getNewUserDialogModule()]}>
                <ConnectedNewUserDialogContent />
            </DynamicModuleLoader>
        );
    }
}
```

When `<NewUserDialog>` is rendered, the `newUserDialog` module will be added to the store. When it is unmounted, the module will be removed from the store and the state will be cleaned up.

Note the props definion for `<DynamicModuleLoader />`:

```typescript
export interface IDynamicModuleLoaderProps {
    /** Modules that need to be dynamically registerd */
    modules: IModuleTuple;
    /**
     * Set this flag to indicate that this component is being rendered in 'Strict Mode'
     * React 'StrictMode' does not allow constructor side-effects, so we defer adding modules to componentDidMount
     * when this flag is set.
     * This has the effect of adding a second render.
     */
    strictMode?: boolean;
    /** Optional callback which returns a store instance. This would be called if no store could be loaded from th  e context. */
    createStore?: () => IModuleStore<any>;
}
```
