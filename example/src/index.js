import React from 'react'
import { render } from 'react-dom'
import { configureStore } from 'redux-dynamic-modules'
import { Provider } from 'react-redux'
import App from './components/App'

const store = configureStore({}, {});

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
