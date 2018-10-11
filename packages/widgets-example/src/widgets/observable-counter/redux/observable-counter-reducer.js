import produce from "immer";

export const observableCounterReducer = (state, action) => {
    return produce(state || {}, draft => {
        switch (action.type) {
            case 'Counter/Increment': {
                const counter = (draft.counter || 0) + 1;
                draft.counter = counter;
                break;
            }
        }
    });
}