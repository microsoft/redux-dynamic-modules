import produce from "immer";

export const observableCounterReducer = (state, action) => {
    return produce(state || null, draft => {
        switch (action.type) {
            case 'Counter/Increment': {
                const counter = ((draft.counterAwareState && draft.counterAwareState.counter) || 0) + 1;
                draft.counterAwareState = { counter };
                break;
            }
        }
    });
}