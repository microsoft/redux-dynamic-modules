import React from 'react'
import { render } from 'react-dom'
import { configureStore } from 'redux-dynamic-modules'
import { Provider } from 'react-redux'
import App from './components/App'
import { getTodoModule } from './modules/todo/todoModule';

const store = configureStore({}, {}, getTodoModule());

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
