const rootReducer = (state = "", action) => {
  switch (action.type) {
    case 'SHOW_VIEW':
      debugger;
      return action.text;
    default:
      return state;
  }
}

export default rootReducer;