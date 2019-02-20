const rootReducer = (state = "", action) => {
    switch (action.type) {
        case "SHOW_VIEW":
            return action.text;
        default:
            return state;
    }
};

export default rootReducer;
