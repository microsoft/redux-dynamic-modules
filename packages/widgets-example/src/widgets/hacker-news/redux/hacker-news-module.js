import { hackerNewsReducer } from "./hacker-news-reducer";
import { fetchStories } from "./hacker-news-actions";

export function getHackerNewsModule() {
    return {
        id: "hacker-news",
        reducerMap: {
            hackerNews: hackerNewsReducer
        },
        initialActions: [fetchStories()]
    };
}