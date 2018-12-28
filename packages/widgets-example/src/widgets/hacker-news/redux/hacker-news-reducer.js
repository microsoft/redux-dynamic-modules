import produce from "immer";
import { HackerNewsStoriesAvailable } from "./hacker-news-actions";

export const hackerNewsReducer = (state, action) => {
    return produce(state || { items: [] }, draft => {
        switch (action.type) {
            case HackerNewsStoriesAvailable: {
                draft.items = action.payload.items;
                break;
            }
            default: {
                //do nothing
            }
        }
    });
};
