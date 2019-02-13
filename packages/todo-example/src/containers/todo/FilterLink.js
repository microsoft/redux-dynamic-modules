import { connect } from "react-redux";
import { setVisibilityFilter } from "../../modules/todo/actions";
import Link from "../../components/todo/Link";

const mapStateToProps = (state, ownProps) => {
    if (state && state.todo) {
        return {
            active: ownProps.filter === state.todo.visibilityFilter,
        };
    } else {
        return {
            active: false,
        };
    }
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    onClick: () => dispatch(setVisibilityFilter(ownProps.filter)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Link);
