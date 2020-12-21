import React, {
  useState,
  useEffect,
} from 'react'
import {
  Layout,
  Menu,
} from 'antd'
import {
  UserAddOutlined,
  VideoCameraAddOutlined,
  FileTextOutlined,
  NotificationOutlined,
} from '@ant-design/icons'

const { Sider } = Layout
const { SubMenu } = Menu

interface Props {
  location: any,
  // history: any,
}

const nav = [
  {
    key: 'key1',
    icon: <UserAddOutlined />,
    title: '用户管理',
    value: [
      {
        key: '/main/user',
        value: '用户列表',
      },
    ],
  },
  {
    key: 'key2',
    icon: <VideoCameraAddOutlined />,
    title: '视频管理',
    value: [
      {
        key: '/main/video',
        value: '视频列表',
      },
      {
        key: '/main/video/add',
        value: '视频新增',
      },
    ],
  },
  {
    key: 'key3',
    icon: <FileTextOutlined />,
    title: 'Wiki 管理',
    value: [
      {
        key: '/main/wiki',
        value: 'Wiki 列表',
      },
      {
        key: '/main/wiki/add',
        value: 'Wiki 新增',
      },
    ],
  },
  {
    key: 'key4',
    icon: <NotificationOutlined />,
    title: '宣传管理',
    value: [
      {
        key: '/main/publicity',
        value: '宣传列表',
      },
      {
        key: '/main/publicity/add',
        value: '宣传新增',
      },
    ],
  },
]


export default (
  {
    location,
    // history,
  }: Props,
) => {
  const { pathname } = location
  const rootSubmenuKeys = nav.map(v => v.key)
  const [openKeys, setOpenKeys] = useState(null)
  const [selectKeys, setSelectKeys] = useState(null)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const ok = nav.find(v => v.value.find(m => m.key === pathname))?.key
    if (ok) setOpenKeys(ok)
    setSelectKeys(pathname)
  }, [pathname])

  const onOpenChange = ok => {
    const latestOpenKey = ok.find(key => openKeys.indexOf(key) === -1)
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(ok)
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
    }
  }

  return (
    <>
      {
        selectKeys
          ? (
            <Sider
              collapsed={collapsed}
              collapsible
              onCollapse={() => setCollapsed(!collapsed)}
            >
              <Menu
                mode="inline"
                defaultOpenKeys={[openKeys]}
                defaultSelectedKeys={[selectKeys]}
                onOpenChange={e => onOpenChange(e)}
                onClick={
                  ({ keyPath }) => {
                    // history.push(`${keyPath[0]}`)
                    window.location.href = `${keyPath[0]}`
                  }
                }
                theme="dark"
                style={{
                  height: '100%',
                }}
              >
                {
                  nav.map(
                    v => (
                      <SubMenu
                        key={v.key}
                        icon={v.icon}
                        title={v.title}
                      >
                        {
                          v.value.map(m => (<Menu.Item key={m.key}>{m.value}</Menu.Item>))
                        }
                      </SubMenu>
                    ),
                  )
                }
              </Menu>
            </Sider>
          ) : null
      }
    </>
  )
}
