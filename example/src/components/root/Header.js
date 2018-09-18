import React from 'react'
import FilterLink from '../../containers/root/FilterLink'
import { VisibilityFilters } from '../../modules/root/actions'

class Header extends React.Component {
  render() {
     return  (
            <div>
              <span>Show: </span>
              <FilterLink filter={VisibilityFilters.SHOW_TOOD}>
                Todo View
              </FilterLink>
              <FilterLink filter={VisibilityFilters.SHOW_SHOPPING_LIST}>
                Shopping List
              </FilterLink>
            </div>
          )
     }
}
export default Header
