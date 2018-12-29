import rootReducer from "./reducers";
export function getRootModule() {
    return {
        id: "root",
        reducerMap: {
            root: rootReducer,
        },
    };
}
