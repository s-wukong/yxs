import React from 'react'
import {
  Route,
  Redirect,
} from 'react-router-dom'

import { Layout } from 'antd'
import User from 'page/user'
import Menu from 'page/menu'

const { Sider, Content } = Layout


interface Props {
  match: any,
}

export default (
  {
    match,
  } : Props,
) => {
  console.log('aaa')

  return (
    <>
      <Layout
        style={{
          height: '100%',
        }}
      >
        <Sider>
          <Menu />
        </Sider>
        <Content>
          <Route exact path={`${match.url}`}>
            <Redirect to={`${match.url}/user`} push />
          </Route>
          <Route path={`${match.url}/user`} component={User} />
        </Content>
      </Layout>
    </>
  )
}
