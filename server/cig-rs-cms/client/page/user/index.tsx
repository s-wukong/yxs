import React, {
  useRef,
  useState,
  useEffect,
} from 'react'
import moment from 'moment'
import {
  Table,
  Avatar,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Space,
} from 'antd'
import {
  UserOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import Highlighter from 'react-highlight-words'

import getAllUser from './getUser'
import getUserScore from './getUserScoreByID'
import getInvitationUser from './getUserInviteByID'
import getCollectUser from './getUserCollect'
import getDownloadUser from './getUserDownloadByID'
import addUserScore from './addUserScore'

interface Filter {
  setSelectedKeys: any,
  selectedKeys: any,
  confirm: any,
  clearFilters: any,
}

export default () => {
  const searchInput = useRef(null)
  const [visible, setVisible] = useState(null)
  const [handle, setHandle] = useState(null)
  const [user, setUser] = useState(null)
  const [score, setScore] = useState(null)
  const [invitation, setInvitation] = useState(null)
  const [download, setDownload] = useState(null)
  const [collect, setCollect] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [searchColumn, setSearchColumn] = useState('')

  const info = (v) => (handle ? user.find(m => m.user_id === handle)[v] : '用户')

  const formatLevel = (v) => {
    let level = 0
    if (v < 50) {
      level = 0
    } else if (v < 300) {
      level = 1
    } else if (v < 2000) {
      level = 2
    } else {
      level = 3
    }
    return level
  }

  const title = {
    invitation: `${info('nick_name')} 邀请列表`,
    collect: `${info('nick_name')} 收藏列表`,
    download: `${info('nick_name')} 下载列表`,
    score: `${info('nick_name')} 当前等级： LV${formatLevel(info('user_score'))} 经验：${info('user_score')}`,
  }

  useEffect(async () => setUser(await getAllUser({})), [])

  const getScore = async (id) => {
    setHandle(id)
    setScore(await getUserScore({ user_id: id }))
    setVisible('score')
  }

  const getInvitation = async (id) => {
    setHandle(id)
    setInvitation(await getInvitationUser({ user_id: id }))
    setVisible('invitation')
  }

  const getDownload = async (id) => {
    setHandle(id)
    setDownload(await getDownloadUser({ user_id: id }))
    setVisible('download')
  }

  const getCollect = async (id) => {
    setHandle(id)
    setCollect(await getCollectUser({ user_id: id }))
    setVisible('collect')
  }

  const addScore = async (v) => {
    const rst = await addUserScore({
      user_id: handle,
      score_type: 100,
      score: v.score,
      score_desc: v.score_desc,
    })
    if (rst.detail_id) {
      const newScore = [...score]
      newScore.unshift(rst)
      setScore(newScore)
      setUser(
        user.map(
          m => (
            m.user_id === rst.user_id
              ? {
                ...m,
                user_score: m.user_score + Number(rst.score),
              } : m
          ),
        ),
      )
      message.info('添加成功!')
    }
  }

  const columnSearchProps = dataIndex => ({
    filterDropdown: (
      {
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }: Filter,
    ) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={
            e => {
              setSelectedKeys(e.target.value ? [e.target.value] : [])
              // setSearchText(e.target.value)
            }
          }
          onPressEnter={
            () => {
              confirm()
              setSearchText(selectedKeys[0])
              setSearchColumn(dataIndex)
            }
          }
          style={{
            width: 188,
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: '90px',
            }}
            onClick={
              () => {
                confirm()
                setSearchText(selectedKeys[0])
                setSearchColumn(dataIndex)
              }
            }
          >
            搜索
          </Button>
          <Button
            onClick={
              () => {
                clearFilters()
                setSearchText('')
              }
            }
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) => (
      record[dataIndex]
        ? record[dataIndex]
          ?.toString()
          ?.toLowerCase()
          ?.includes(value?.toLowerCase())
        : ''
    ),
    onFilterDropdownVisibleChange: v => {
      if (v) {
        setTimeout(
          () => {
            searchInput.current.select()
          },
          100,
        )
      }
    },
    render: v => (
      searchColumn === dataIndex
        ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={v ? v.toString() : ''}
          />
        ) : v
    ),
  })

  const columns = [
    {
      title: 'ID',
      dataIndex: 'user_id',
      key: 'user_id',
      sorter: (a, b) => (a.user_id - b.user_id),
      sortDirections: ['ascend'],
      ...columnSearchProps('user_id'),
    },
    {
      title: '用户名',
      dataIndex: 'nick_name',
      key: 'nick_name',
      sorter: (a, b) => a?.nick_name?.localeCompare(b?.nick_name),
      ...columnSearchProps('nick_name'),
    },
    {
      title: '头像',
      dataIndex: 'avatar_url',
      key: 'avatar_url',
      render: text => (
        <Avatar
          icon={<UserOutlined />}
          size={40}
          src={text}
        />
      ),
      sorter: (a, b) => a?.avatar_url?.localeCompare(b?.avatar_url),
      shouldCellUpdate: (record, prevRecord) => (record.avatar_url !== prevRecord.avatar_url),
    },
    {
      title: '姓名',
      dataIndex: 'user_name',
      key: 'user_name',
      sorter: (a, b) => a?.user_name?.localeCompare(b?.user_name),
      ...columnSearchProps('user_name'),
    },
    {
      title: '手机号',
      dataIndex: 'phone_number',
      key: 'phone_number',
      sorter: (a, b) => (a.phone_number - b.phone_number),
      ...columnSearchProps('phone_number'),
    },
    {
      title: '公司',
      dataIndex: 'company',
      key: 'company',
      sorter: (a, b) => a?.company?.localeCompare(b?.company),
      ...columnSearchProps('company'),
    },
    {
      title: '职务',
      dataIndex: 'position',
      key: 'position',
      sorter: (a, b) => a?.position?.localeCompare(b?.position),
      ...columnSearchProps('position'),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a?.email?.localeCompare(b?.email),
      ...columnSearchProps('email'),
    },
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
      sorter: (a, b) => a?.platform?.localeCompare(b?.platform),
      ...columnSearchProps('platform'),
    },
    {
      title: '经验',
      dataIndex: 'user_score',
      key: 'user_score',
      render: (v, d) => (
        <>
          <Button
            type="primary"
            size="middle"
            onClick={() => getScore(d.user_id)}
          >
            {v}
          </Button>
        </>
      ),
      sorter: (a, b) => (a.user_score - b.user_score),
      shouldCellUpdate: (record, prevRecord) => (record.user_score !== prevRecord.user_score),
    },
    {
      title: '等级',
      dataIndex: 'user_score',
      key: 'user_score',
      render: (v) => formatLevel(v),
      sorter: (a, b) => (a.user_score - b.user_score),
      shouldCellUpdate: (record, prevRecord) => (record.user_score !== prevRecord.user_score),
    },
    {
      title: '邀请用户数',
      dataIndex: 'invite_count',
      key: 'invite_count',
      render: (v, d) => (
        <>
          <Button
            type="primary"
            size="middle"
            onClick={
              () => {
                getInvitation(d.user_id)
              }
            }
          >
            {v}
          </Button>
        </>
      ),
      sorter: (a, b) => (a.invite_count - b.invite_count),
    },
    {
      title: '报告下载数',
      dataIndex: 'download_count',
      key: 'download_count',
      render: (v, d) => (
        <>
          <Button
            type="primary"
            size="middle"
            onClick={() => getDownload(d.user_id)}
          >
            {v}
          </Button>
        </>
      ),
      sorter: (a, b) => (a.download_count - b.download_count),
    },
    {
      title: '收藏数',
      dataIndex: 'collect_count',
      key: 'collect_count',
      render: (v, d) => (
        <>
          <Button
            type="primary"
            size="middle"
            onClick={() => getCollect(d.user_id)}
          >
            {v}
          </Button>
        </>
      ),
      sorter: (a, b) => (a.collect_count - b.collect_count),
    },
    {
      title: '注册时间',
      dataIndex: 'registration_time',
      key: 'registration_time',
      render: t => (<>{moment(t).format('YYYY-MM-DD HH:mm:ss')}</>),
      sorter: (a, b) => (a.registration_time - b.registration_time),
    },
    {
      title: '最后一次登录时间',
      dataIndex: 'last_login_time',
      key: 'last_login_time',
      render: t => (<>{moment(t).format('YYYY-MM-DD HH:mm:ss')}</>),
      sorter: (a, b) => (a.last_login_time - b.last_login_time),
    },
  ]

  return (
    <>
      <Table
        columns={columns}
        rowKey={(record) => record.user_id}
        dataSource={user}
        scroll={{
          x: true,
        }}
      />
      <Modal
        title={title[visible]}
        visible={visible}
        footer={null}
        onCancel={
          () => {
            setHandle(null)
            setVisible(null)
          }
        }
        destroyOnClose
      >
        {
          visible === 'score' && typeof score === 'object'
            ? (
              <>
                <Form
                  name="basic"
                  onFinish={addScore}
                >
                  <Form.Item
                    label="修改经验"
                    name="score"
                    rules={[{ required: true, message: '请填写经验数字!' }]}
                  >
                    <InputNumber
                      style={{
                        width: '100%',
                      }}
                      placeholder="输入负数即为删除对应经验"
                    />
                  </Form.Item>
                  <Form.Item
                    label="修改说明"
                    name="score_desc"
                    rules={[{ required: true, message: '请填写修改说明!' }]}
                  >
                    <Input
                      placeholder="修改明细说明"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                    >
                      确定
                    </Button>
                  </Form.Item>
                </Form>
                <Table
                  size="small"
                  rowKey="detail_id"
                  columns={
                    [
                      {
                        title: '经验说明',
                        dataIndex: 'score_desc',
                        key: 'score_desc',
                      },
                      {
                        title: '经验',
                        dataIndex: 'score',
                        key: 'score',
                      },
                      {
                        title: '时间',
                        dataIndex: 'score_time',
                        key: 'score_time',
                        render: (v) => (<>{moment(v).format('YYYY-MM-DD HH:mm:ss')}</>),
                      },
                    ]
                  }
                  dataSource={score}
                />
              </>
            ) : null
        }
        {
          visible === 'invitation' && typeof invitation === 'object'
            ? (
              <>
                <Table
                  size="small"
                  columns={
                    [
                      {
                        title: '邀请用户名',
                        dataIndex: 'nick_name',
                        key: 'nick_name',
                      },
                      {
                        title: '经验',
                        dataIndex: 'score',
                        key: 'score',
                      },
                      {
                        title: '注册时间',
                        dataIndex: 'registration_time',
                        key: 'registration_time',
                        render: (v) => (<>{moment(v).format('YYYY-MM-DD HH:mm:ss')}</>),
                      },
                      {
                        title: '最后一次登录时间',
                        dataIndex: 'last_login_time',
                        key: 'last_login_time',
                        render: (v) => (<>{moment(v).format('YYYY-MM-DD HH:mm:ss')}</>),
                      },
                    ]
                  }
                  dataSource={invitation}
                />
              </>
            ) : null
        }
        {
          visible === 'download' && typeof download === 'object'
            ? (
              <>
                <Table
                  size="small"
                  columns={
                    [
                      {
                        title: '报告名称',
                        dataIndex: 'title',
                        key: 'title',
                      },
                      {
                        title: '下载时间',
                        dataIndex: 'download_time',
                        key: 'download_time',
                        render: (v) => (<>{moment(v).format('YYYY-MM-DD HH:mm:ss')}</>),
                      },
                    ]
                  }
                  dataSource={download}
                />
              </>
            ) : null
        }
        {
          visible === 'collect' && typeof collect === 'object'
            ? (
              <>
                <Table
                  size="small"
                  columns={
                    [
                      {
                        title: '名称',
                        dataIndex: 'id',
                        key: 'id',
                        render: (v, d) => (
                          <>
                            {
                              d.content_type === 1 ? d.video_title : d.report_title
                            }
                          </>
                        ),
                      },
                      {
                        title: '下载时间',
                        dataIndex: 'collect_time',
                        key: 'collect_time',
                        render: (v) => (<>{moment(v).format('YYYY-MM-DD HH:mm:ss')}</>),
                      },
                    ]
                  }
                  dataSource={collect}
                />
              </>
            ) : null
        }
      </Modal>
    </>
  )
}
