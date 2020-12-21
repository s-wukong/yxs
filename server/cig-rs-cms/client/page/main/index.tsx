import React from 'react'
import {
  Route,
  Redirect,
} from 'react-router-dom'

import {
  Layout,
} from 'antd'
import Menu from 'page/menu'
import Header from 'page/header'
import User from 'page/user'
import Video from 'page/video'
import VideoAdd from 'page/videoAdd'
import VideoEdit from 'page/videoEdit'
import Wiki from 'page/wiki'
import WikiAdd from 'page/wikiAdd'
import WikiEdit from 'page/wikiEdit'
import Publicity from 'page/publicity'
import PublicityAdd from 'page/publicityAdd'

const { Content } = Layout


interface Props {
  match: any,
  history: any,
  location: any,
}

export default (
  {
    match,
    history,
    location,
  } : Props,
) => (
  <>
    <Layout
      style={{
        height: '100%',
      }}
    >
      <Header />
      <Layout>
        <Menu
          match={match}
          history={history}
          location={location}
        />
        <Content
          style={{
            padding: '20px',
          }}
        >
          <Route exact path={`${match.url}`}>
            <Redirect to={`${match.url}/user`} push />
          </Route>
          <Route exact path={`${match.url}/user`} component={User} />
          <Route exact path={`${match.url}/video`} component={Video} />
          <Route exact path={`${match.url}/video/add`} component={VideoAdd} />
          <Route exact path={`${match.url}/video/edit/:id`} component={VideoEdit} />
          <Route exact path={`${match.url}/wiki`} component={Wiki} />
          <Route exact path={`${match.url}/wiki/add`} component={WikiAdd} />
          <Route exact path={`${match.url}/wiki/edit/:id`} component={WikiEdit} />
          <Route exact path={`${match.url}/publicity`} component={Publicity} />
          <Route exact path={`${match.url}/publicity/add`} component={PublicityAdd} />
        </Content>
      </Layout>
    </Layout>
  </>
)
