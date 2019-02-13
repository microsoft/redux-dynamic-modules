# Dynamic Module Loader

`redux-dynamic-modules` provides a `DynamicModuleLoader` React component, which allows you to add/remove modules when a component is rendered.

## Example {docsify-ignore}

```typescript
import { DynamicModuleLoader } from "redux-dynamic-modules-react";
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
