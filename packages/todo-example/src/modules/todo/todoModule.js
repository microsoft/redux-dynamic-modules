import todoReducer from "./reducers"
export function getTodoModule() {
    return {
        id: "todo",
        reducerMap: {
            todo: todoReducer
        }
    }
}