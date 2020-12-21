import React, {
  useState,
} from 'react'
import { Menu } from 'antd'
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons'

const { SubMenu } = Menu

export default () => {
  const rootSubmenuKeys = ['sub1', 'sub2', 'sub3']
  const [openKeys, setOpenKeys] = useState(['sub1'])

  const onOpenChange = ok => {
    const latestOpenKey = ok.find(key => openKeys.indexOf(key) === -1)
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(ok)
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
    }
  }

  return (
    <Menu
      mode="inline"
      openKeys={openKeys}
      onOpenChange={e => onOpenChange(e)}
      style={{
        width: 200,
        height: '100%',
      }}
    >
      <SubMenu
        key="sub1"
        title={
          <span>
            <MailOutlined />
            <span>用户管理</span>
          </span>
        }
      >
        <Menu.Item key="1">用户列表</Menu.Item>
      </SubMenu>
      <SubMenu
        key="sub2"
        icon={<AppstoreOutlined />}
        title="视频管理"
      >
        <Menu.Item key="2">视频列表</Menu.Item>
        <Menu.Item key="3">视频新建</Menu.Item>
      </SubMenu>
      <SubMenu
        key="sub3"
        icon={<SettingOutlined />}
        title="Wiki 管理"
      >
        <Menu.Item key="4">Wiki 列表</Menu.Item>
        <Menu.Item key="5">Wiki 新建</Menu.Item>
        <Menu.Item key="6">宣传 列表</Menu.Item>
        <Menu.Item key="7">宣传 新建</Menu.Item>
      </SubMenu>
    </Menu>
  )
}
