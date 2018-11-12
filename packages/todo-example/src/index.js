import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux-dynamic-modules'
import { Provider } from 'react-redux'
import App from './components/App'

const store = createStore({}, [], []);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
