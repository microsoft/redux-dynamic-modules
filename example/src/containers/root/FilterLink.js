import { connect } from 'react-redux'
import { setVisibilityFilter } from '../../modules/root/actions'
import Link from '../../components/root/Link'

const mapStateToProps = (state, ownProps) => ({
  active: ownProps.filter === state.root.visibilityFilter
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => dispatch(setVisibilityFilter(ownProps.filter))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Link)
