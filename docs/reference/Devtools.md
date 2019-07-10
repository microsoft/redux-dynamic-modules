# Redux Devtools Extension

`redux-dynamic-modules` integrates with [Redux devtools](https://github.com/zalmoxisus/redux-devtools-extension) by default using its default options. If you want to use custom devtools options, you can use the `compose` property when creating a store:

```typescript
import { createStore } from "redux-dynamic-modules";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";

const store = createStore({
    compose: composeWithDevTools({
        maxAge: 500,
    }),
});
```
