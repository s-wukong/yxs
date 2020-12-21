import React, {
  useRef,
  useState,
  useEffect,
} from 'react'
import moment from 'moment'
import {
  Table,
  Image,
  Button,
  Modal,
  Popconfirm,
  message,
  Input,
  Space,
} from 'antd'
import {
  SearchOutlined,
} from '@ant-design/icons'
import Highlighter from 'react-highlight-words'

import getAllVideo from './getAllVideo'
import deleteVideoByID from './deleteVideoByID'
import getCommentByVideoID from './getVideoCommnet'
import deleteCommentByID from './deleteVideoCommentByID'

interface Filter {
  setSelectedKeys: any,
  selectedKeys: any,
  confirm: any,
  clearFilters: any,
}

export default () => {
  const searchInput = useRef(null)
  const [handle, setHandle] = useState(null)
  const [visible, setVisible] = useState(null)
  const [video, setVideo] = useState(null)
  const [comment, setComment] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [searchColumn, setSearchColumn] = useState('')

  useEffect(async () => setVideo(await getAllVideo({})), [])

  const getComment = async (id) => {
    setComment(await getCommentByVideoID({ video_id: id }))
    setHandle(id)
    setVisible('comment')
  }

  const deleteVideo = async (id) => {
    const rst = await deleteVideoByID({ video_id: id })
    if (rst.video_id) {
      message.info('删除成功!')
      setVideo(video.filter(v => v.video_id !== rst.video_id))
    } else {
      message.error(rst)
    }
  }

  const deleteComment = async (id) => {
    const rst = await deleteCommentByID({ id })
    if (rst.id) {
      message.info('删除成功!')
      setComment(comment.filter(v => v.id !== rst.id))
    } else {
      message.error(rst)
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
      dataIndex: 'video_id',
      key: 'video_id',
      sorter: (a, b) => (a.video_id - b.video_id),
      sortDirections: ['ascend'],
      ...columnSearchProps('video_id'),
    },
    {
      title: 'Banner',
      dataIndex: 'banner_url',
      key: 'banner_url',
      render: text => (
        <Image
          width={100}
          src={text}
        />
      ),
      sorter: (a, b) => a?.banner_url?.localeCompare(b?.banner_url),
    },
    {
      title: '主讲人',
      dataIndex: 'speaker',
      key: 'speaker',
      sorter: (a, b) => a?.speaker?.localeCompare(b?.speaker),
      ...columnSearchProps('speaker'),
    },
    {
      title: '课题',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a?.title?.localeCompare(b?.title),
      ...columnSearchProps('title'),
    },
    {
      title: '上传/发布时间',
      dataIndex: 'upload_time',
      key: 'upload_time',
      render: (t) => (<>{moment(t).format('YYYY-MM-DD HH:mm:ss')}</>),
      sorter: (a, b) => (a.upload_time - b.upload_time),
    },
    {
      title: '播放量',
      dataIndex: 'video_visit',
      key: 'video_visit',
      sorter: (a, b) => (a.video_visit - b.video_visit),
    },
    {
      title: '点赞量',
      dataIndex: 'video_like',
      key: 'video_like',
      sorter: (a, b) => (a.video_like - b.video_like),
    },
    {
      title: '分享量',
      dataIndex: 'video_share',
      key: 'video_share',
      sorter: (a, b) => (a.video_share - b.video_share),
    },
    {
      title: '收藏量',
      dataIndex: 'video_collect',
      key: 'video_collect',
      sorter: (a, b) => (a.video_collect - b.video_collect),
    },
    {
      title: '评论量',
      dataIndex: 'video_comment',
      key: 'video_comment',
      render: (v, d) => (
        <>
          <Button
            type="primary"
            size="middle"
            onClick={() => getComment(d.video_id)}
          >
            {v}
          </Button>
        </>
      ),
      sorter: (a, b) => (a.video_comment - b.video_comment),
    },
    {
      title: '顺序',
      dataIndex: 'order_key',
      key: 'order_key',
      sorter: (a, b) => (a.order_key - b.order_key),
    },
    {
      title: '',
      dataIndex: 'video_id',
      key: 'video_id',
      render: (v) => (
        <>
          <Button
            type="dashed"
            size="middle"
            /*
            onClick={
              () => {
                deleteVideo(v)
              }
            }
            */
          >
            <Popconfirm
              title="确认删除视频?"
              onConfirm={() => deleteVideo(v)}
              // onCancel={cancel}
              okText="确认"
              cancelText="取消"
            >
              删除
            </Popconfirm>
          </Button>
          <br />
          <Button
            type="primary"
            size="middle"
            onClick={() => { window.location.href = `/main/video/edit/${v}` }}
            style={{ margin: '5px 0 0 0' }}
          >
            编辑
          </Button>
        </>
      ),
    },
  ]

  return (
    <>
      <Table
        columns={columns}
        rowKey={(record) => record.video_id}
        dataSource={video}
        scroll={{
          x: true,
        }}
      />
      <Modal
        visible={visible}
        footer={null}
        width={800}
        onCancel={
          () => {
            setHandle(null)
            setVisible(null)
          }
        }
        destroyOnClose
      >
        {
          visible === 'comment' && typeof comment === 'object'
            ? (
              <>
                <div
                  style={{
                    margin: '10px 0',
                  }}
                >
                  <p>{`主讲人：${video.find(v => (v.video_id === handle)).speaker}`}</p>
                  <p>{`课题：${video.find(v => (v.video_id === handle)).title}`}</p>
                </div>
                <Table
                  size="small"
                  columns={
                    [
                      {
                        title: '用户名',
                        dataIndex: 'from_uname',
                        key: 'from_uname',
                      },
                      {
                        title: '内容',
                        dataIndex: 'conment_content',
                        key: 'conment_content',
                      },
                      {
                        title: '评论时间',
                        dataIndex: 'comment_time',
                        key: 'comment_time',
                        render: (v) => (<>{moment(v).format('YYYY-MM-DD HH:mm:ss')}</>),
                      },
                      {
                        title: '',
                        dataIndex: 'id',
                        key: 'id',
                        render: (v) => (
                          <>
                            <Button
                              type="primary"
                              size="small"
                              onClick={() => deleteComment(v)}
                            >
                              删除
                            </Button>
                          </>
                        ),
                      },
                    ]
                  }
                  dataSource={comment}
                />
              </>
            ) : null
        }
      </Modal>
    </>
  )
}
