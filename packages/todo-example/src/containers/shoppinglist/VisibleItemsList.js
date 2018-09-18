import { connect } from 'react-redux'
import { toggleItem } from '../../modules/shoppinglist/actions'
import ItemList from '../../components/shoppinglist/ItemList'
import { VisibilityFilters } from '../../modules/shoppinglist/actions'

const getVisibleItems = (items, filter) => {
  switch (filter) {
    case VisibilityFilters.SHOW_ALL:
      return items
    case VisibilityFilters.SHOW_COMPLETED:
      return items.filter(t => t.completed)
    case VisibilityFilters.SHOW_ACTIVE:
      return items.filter(t => !t.completed)
    default:
      throw new Error('Unknown filter: ' + filter)
  }
}

const mapStateToProps = state => ({
  todos: getVisibleItems(state.shoppingList.items, state.shoppingList.visibilityFilter)
})

const mapDispatchToProps = dispatch => ({
  toggleItem: id => dispatch(toggleItem(id))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemList)
