import { connect } from "react-redux";
import { setVisibilityFilter } from "../../modules/root/actions";
import Link from "../../components/root/Link";

const mapStateToProps = (state, ownProps) => {
    if (state && state.root) {
        return {
            active: ownProps.filter === state.root.visibilityFilter,
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
