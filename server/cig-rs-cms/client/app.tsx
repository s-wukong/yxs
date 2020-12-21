import React from 'react'
import {
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'

import Login from './page/login'
import Main from './page/main'
import 'antd/dist/antd.css'
import './style.css'

const App = () => (
  <Switch>
    <Route exact path="/">
      <Redirect to="/login" push />
    </Route>
    <Route path="/login" component={Login} />
    <Route path="/main" component={Main} />
  </Switch>
)

export default App

