## Usage with redux-thunk
You can use `redux-dynamic-modules` alongside `redux-thunk`.

To use
* `npm install redux-dynamic-modules-thunk`
* Add the thunk extension to the `configureStore` call

```typescript
import { configureStore, IModuleStore } from "redux-dynamic-modules";
import { getThunkExtension } from "redux-dynamic-modules-thunk";
import { getUsersModule } from "./usersModule";

const store: IModuleStore<IState> = configureStore(
/* initial state */
{},

/* Extensions to load */
[getThunkExtension()],

getUsersModule(), 
/* ...any additional modules */
);
```

Now, you will be able to use thunks as well