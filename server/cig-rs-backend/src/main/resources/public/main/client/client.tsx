import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { AppContainer } from 'react-hot-loader'
// import logger from 'redux-logger'

import rootReducer from './reducers'
import App from './app'

// const middleware = [thunk, logger]
const middleware = [thunk]
const store = createStore(
  rootReducer,
  applyMiddleware(...middleware),
) || null

const hotRender = () => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    </AppContainer>,
    // document.getElementById('app'),
    document.body,
  )
}

hotRender()

if (module.hot) {
  module.hot.accept('./app', () => {
    hotRender()
  })
}
