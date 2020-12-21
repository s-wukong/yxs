import React from 'react'
import {
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'

import Main from './page/main'
import 'antd/dist/antd.css'

const App = () => (
  <Switch>
    <Route exact path="/">
      <Redirect to="/main" push />
    </Route>
    <Route path="/main" component={Main} />
  </Switch>
)

export default App
