import React, {
  useState,
  useEffect,
} from 'react'
import {
  Table,
  Avatar,
  Button,
  Modal,
} from 'antd'
import {
  UserOutlined,
} from '@ant-design/icons'

import getUser from './get'

export default () => {
  const [visible, setVisible] = useState(false)
  const [data, setData] = useState(null)

  useEffect(async () => setData(await getUser({})), [])

  console.log(typeof setVisible)

  const columns = [
    {
      title: 'ID',
      dataIndex: 'userId',
      key: 'userId',
      render: text => (<>{text}</>),
    },
    {
      title: '用户名',
      dataIndex: 'nickName',
      key: 'nickName',
    },
    {
      title: '头像',
      dataIndex: 'avatarUrl',
      key: 'avatarUrl',
      render: text => (
        <Avatar
          icon={<UserOutlined />}
          size={40}
          src={text}
        />
      ),
    },
    {
      title: '姓名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '手机号',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: '公司',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: '职务',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '注册时间',
      dataIndex: 'registrationTime',
      key: 'registrationTime',
    },
    {
      title: '最后一次登录时间',
      dataIndex: 'lastSignInTime',
      key: 'lastSignInTime',
    },
    {
      title: '邀请用户数',
      dataIndex: 'inviteCount',
      key: 'inviteCount',
      render: v => (
        <>
          <Button
            type="primary"
            size="middle"
            onClick={() => setVisible(true)}
          >
            {v}
          </Button>
        </>
      ),
    },
    {
      title: '报告下载',
      dataIndex: 'reportDownloadCount',
      key: 'reportDownloadCount',
      render: v => (
        <>
          <Button
            type="primary"
            size="middle"
          >
            {v}
          </Button>
        </>
      ),
    },
    {
      title: '收藏',
      dataIndex: 'collectCount',
      key: 'collectCount',
      render: v => (
        <>
          <Button
            type="primary"
            size="middle"
          >
            {v}
          </Button>
        </>
      ),
    },
  ]

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
      />
      <Modal
        title="Basic Modal"
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  )
}
