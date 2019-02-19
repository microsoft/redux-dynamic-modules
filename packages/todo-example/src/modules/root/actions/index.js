export const setVisibilityFilter = text => {
    return {
        type: "SHOW_VIEW",
        text,
    };
};
export const VisibilityFilters = {
    SHOW_TOOD: "SHOW_TODO",
    SHOW_SHOPPING_LIST: "SHOW_SHOPPING_LIST",
};
