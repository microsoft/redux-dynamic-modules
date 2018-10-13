import produce from "immer";
import { HackerNewsStoriesAvailable } from "./hacker-news-actions";

export const hackerNewsReducer = (state, action) => {
    return produce(state || { items: [] }, draft => {
        switch (action.type) {
            case HackerNewsStoriesAvailable: {
                draft.hackerNews = { items: action.payload.items };
                break;
            }
            default: {
                //do nothing
            }
        }
    });
}