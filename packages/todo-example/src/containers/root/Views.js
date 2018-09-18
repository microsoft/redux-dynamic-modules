import React from 'react'
import PropTypes from 'prop-types'
import {
    connect
} from 'react-redux'
import {
    VisibilityFilters
} from '../../modules/root/actions'
import TodoView from '../todo/TodoView';
import ShoppingListView from '../shoppinglist/ShoppingListView';

const mapStateToProps = (state) => {
    return {
        visibilityFilter: state.root
    }
}

const Views = ({visibilityFilter}) => {
        if (visibilityFilter === VisibilityFilters.SHOW_TOOD) {
            return <TodoView / >
        }
        if (visibilityFilter === VisibilityFilters.SHOW_SHOPPING_LIST) {
            return <ShoppingListView / >
        }
        return null;
    }
Views.propTypes = {
    visibilityFilter: PropTypes.string.isRequired
};

export default connect(
    mapStateToProps
)(Views)