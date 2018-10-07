import { hackerNewsReducer } from "./hacker-news-reducer";

export function getHackerNewsModule() {
    return {
        id: "hacker-news",
        reducerMap: {
            hackerNews: hackerNewsReducer
        }
    };
}