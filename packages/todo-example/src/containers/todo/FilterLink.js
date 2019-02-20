import { connect } from "react-redux";
import { setVisibilityFilter } from "../../modules/todo/actions";
import Link from "../../components/todo/Link";

const mapStateToProps = (state, ownProps) => ({
    active: ownProps.filter === state.root.visibilityFilter,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onClick: () => dispatch(setVisibilityFilter(ownProps.filter)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Link);
