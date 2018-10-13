import { connect } from "react-redux";
import React from 'react';

const Link = ({ title, url }) => {
    return (
        <div>
            <a href={url}>{title}</a>
        </div>
        );
};

const List = ({ items }) => {
    return (
        items
            .map(item => <Link {...item} />)
    );
};

const HackerNews = ({ items }) => {
    if(items.length === 0) {
        return <div>Loading...</div>;
    }
    
    return (
        <div>
            <div>Hacker News - Top 5</div>
            <List items={items} />
        </div>
    );
};

const mapStateToProps = (state) =>{
    return {
        items: state.hackerNews.items
    }
};

export const ConnectedHackerNews = connect(mapStateToProps)(HackerNews);

