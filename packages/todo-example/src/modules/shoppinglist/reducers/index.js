import { combineReducers } from "redux";
import items from "./items";
import visibilityFilter from "./visibilityFilter";

export default combineReducers({
    items,
    visibilityFilter,
});
