import { connect } from "react-redux";
import { setVisibilityFilter } from "../../modules/shoppinglist/actions";
import Link from "../../components/shoppinglist/Link";

const mapStateToProps = (state, ownProps) => {
    if (state.shoppingList) {
        return {
            active: ownProps.filter === state.shoppingList.visibilityFilter,
        };
    }
    return { active: false };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    onClick: () => dispatch(setVisibilityFilter(ownProps.filter)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Link);
