let nextItemId = 0;
export const addItem = text => ({
    type: "ADD_ITEM",
    id: nextItemId++,
    text,
});

export const setVisibilityFilter = filter => ({
    type: "SET_VISIBILITY_FILTER_ITEMS",
    filter,
});

export const toggleItem = id => ({
    type: "TOGGLE_ITEM",
    id,
});

export const VisibilityFilters = {
    SHOW_ALL: "SHOW_ALL_ITEMS",
    SHOW_COMPLETED: "SHOW_COMPLETED_ITEMS",
    SHOW_ACTIVE: "SHOW_ACTIVE_ITEMS",
};
