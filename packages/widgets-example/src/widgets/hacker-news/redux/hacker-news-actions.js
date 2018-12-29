export const HackerNewsStoriesAvailable = "hackernews/storiesavailable";
export const HackerNewsLoadStories = "hackernews/loadstories";

// action creator : StoriesAvailable
export const storiesAvailable = items => {
    return {
        type: HackerNewsStoriesAvailable,
        payload: {
            items,
        },
    };
};

// thunk to fetch the stories
export const fetchStories = () => {
    return (dispatch, getState) => {
        fetchJson("https://hacker-news.firebaseio.com/v0/topstories.json").then(
            ids => {
                const top5 = ids.splice(0, 5);
                const promises = [];
                for (const id of top5) {
                    promises.push(
                        fetchJson(
                            "https://hacker-news.firebaseio.com/v0/item/" +
                                id +
                                ".json"
                        )
                    );
                }
                Promise.all(promises).then(stories => {
                    dispatch(storiesAvailable(stories));
                });
            }
        );
    };
};

// Helper to fetch the json
const fetchJson = url => {
    return fetch(url).then(response => {
        return response.json();
    });
};
