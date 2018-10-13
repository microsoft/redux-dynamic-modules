import { connect } from "react-redux";
import React from 'react';
import "./hacker-news-component.css";

const Link = ({ title, url }) => {
    return (
        <div className="news-link">
            <a href={url}>{title}</a>
        </div>
    );
};

const List = ({ items }) => {
    return (
        items.map((item, index) => <Link key={index} {...item} />)
    );
};

const HackerNews = ({ items }) => {
    if (items.length === 0) {
        return <div>Loading News...</div>;
    }

    return (
        <div className="news-root">
            <div>Hacker News - Top 5</div>
            <List items={items} />
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        items: state.hackerNews.items
    }
};

export const ConnectedHackerNews = connect(mapStateToProps)(HackerNews);

