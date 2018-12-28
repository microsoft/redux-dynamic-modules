import { hackerNewsReducer } from "./hacker-news-reducer";
import { fetchStories } from "./hacker-news-actions";

export function getHackerNewsModule() {
    return {
        // Unique id of the module
        id: "hacker-news",
        // Maps the Store key to the reducer
        reducerMap: {
            hackerNews: hackerNewsReducer,
        },
        // Optional: Any actions to dispatch when the module is loaded
        initialActions: [fetchStories()],
        // Optional: Any actions to dispatch when the module is unloaded
        finalActions: [],
    };
}
