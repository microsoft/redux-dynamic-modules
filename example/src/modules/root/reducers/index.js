const rootReducer = (state = "", action) => {
  switch (action.type) {
    case 'SHOW_VIEW':
      return action.payload
    default:
      return state
  }
}

export default rootReducer