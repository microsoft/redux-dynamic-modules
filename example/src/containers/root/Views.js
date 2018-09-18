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

class Views extends React.Component {
    render = () => {
        if (this.props.visibilityFilter === VisibilityFilters.SHOW_TOOD) {
            return <TodoView / >
        }
        if (this.props.visibilityFilter === VisibilityFilters.SHOW_SHOPPING_LIST) {
            return <ShoppingListView / >
        }
        return null;
    }
}
Views.propTypes = {
    visibilityFilter: PropTypes.string.isRequired
};

export default connect(
    mapStateToProps
)(Views)