export const HackerNewsStoriesAvailable = "hackernews/storiesavailable";
export const HackerNewsLoadStories = "hackernews/loadstories";

export const storiesAvailable = (items) => {
    return {
        type: HackerNewsStoriesAvailable,
        payload: { items }
    }
};

// thunk to fetch the stories
export const fetchStories = () => {
    return (dispatch, getState) => {
        dispatch(storiesAvailable({
            items: []
        }));
    };
}