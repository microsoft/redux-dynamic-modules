import shoppingListReducer from "./reducers";
export function getShoppingListModule() {
    return {
        id: "shopping-list",
        reducerMap: {
            shoppingList: shoppingListReducer,
        },
    };
}
