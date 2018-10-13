import { connect } from "react-redux";
import React from 'react';

const Link = ({ title, link }) => {
    return <a href={link}>{title}</a>;
};

const List = ({ items }) => {
    return (
        items
            .map(item => <Link {...item} />)
    );
};

const HackerNews = ({ items }) => {
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

