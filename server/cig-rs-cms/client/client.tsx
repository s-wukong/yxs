import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader'
import App from './app'

const hotRender = () => {
  ReactDOM.render(
    <AppContainer>
      <Router>
        <App />
      </Router>
    </AppContainer>,
    document.getElementById('app'),
  )
}

hotRender()

if (module.hot) {
  module.hot.accept('./app', () => {
    hotRender()
  })
}
