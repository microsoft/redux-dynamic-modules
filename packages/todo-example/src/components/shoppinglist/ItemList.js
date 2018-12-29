import React from "react";
import PropTypes from "prop-types";
import Item from "./Item";

const ItemList = ({ todos, toggleItem }) => (
    <ul>
        {todos.map(todo => (
            <Item key={todo.id} {...todo} onClick={() => toggleItem(todo.id)} />
        ))}
    </ul>
);

ItemList.propTypes = {
    todos: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            completed: PropTypes.bool.isRequired,
            text: PropTypes.string.isRequired,
        }).isRequired
    ).isRequired,
    toggleItem: PropTypes.func.isRequired,
};

export default ItemList;
