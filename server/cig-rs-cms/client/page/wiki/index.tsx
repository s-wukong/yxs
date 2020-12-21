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
  Popconfirm,
  message,
  Switch,
  Input,
  Space,
} from 'antd'
import {
  SearchOutlined,
} from '@ant-design/icons'
import Highlighter from 'react-highlight-words'

import getAllWiki from './getAllWiki'
import deleteWikiByID from './deleteWikiByID'
import putWikiByID from './putWiki'

interface Filter {
  setSelectedKeys: any,
  selectedKeys: any,
  confirm: any,
  clearFilters: any,
}

export default () => {
  const searchInput = useRef(null)
  const [wiki, setWiki] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [searchColumn, setSearchColumn] = useState('')

  useEffect(async () => setWiki(await getAllWiki({})), [])

  const deleteWiki = async (id) => {
    const rst = await deleteWikiByID({ id })
    if (rst.id) {
      message.info('删除成功!')
      setWiki(wiki.filter(v => v.id !== rst.id))
    } else {
      message.error(rst)
    }
  }

  const switchByID = async (id, hot) => {
    if (wiki.filter(v => v.is_hot).length >= 10 && hot) {
      message.error('最多可设置 10 个热推')
      return
    }
    const newHot = hot ? 1 : 0
    const rst = await putWikiByID({ id, is_hot: newHot })
    if (rst.id) {
      message.info('设置成功!')
      const newWiki = wiki.map(
        (v) => ({
          ...v,
          is_hot: v.id === rst.id ? newHot : v.is_hot,
        }),
      )
      // 直接设置有问题，先设置为空，异步合并设置
      setWiki([])
      setWiki(newWiki)
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
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
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
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => (a.id - b.id),
      sortDirections: ['ascend'],
      ...columnSearchProps('id'),
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
      title: '出品人',
      dataIndex: 'author',
      key: 'author',
      sorter: (a, b) => a?.author?.localeCompare(b?.author),
      ...columnSearchProps('author'),
    },
    {
      title: '题目',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a?.title?.localeCompare(b?.title),
      ...columnSearchProps('title'),
    },
    {
      title: '上传时间',
      dataIndex: 'upload_time',
      key: 'upload_time',
      render: (t) => (<>{moment(t).format('YYYY-MM-DD HH:mm:ss')}</>),
      sorter: (a, b) => (a.upload_time - b.upload_time),
    },
    {
      title: '阅读量',
      dataIndex: 'wiki_visit',
      key: 'wiki_visit',
      sorter: (a, b) => (a.wiki_visit - b.wiki_visit),
    },
    {
      title: '下载量',
      dataIndex: 'wiki_download',
      key: 'wiki_download',
      sorter: (a, b) => (a.wiki_download - b.wiki_download),
    },
    {
      title: '分享量',
      dataIndex: 'wiki_share',
      key: 'wiki_share',
      sorter: (a, b) => (a.wiki_share - b.wiki_share),
    },
    {
      title: '收藏量',
      dataIndex: 'wiki_collect',
      key: 'wiki_collect',
      sorter: (a, b) => (a.wiki_collect - b.wiki_collect),
    },
    {
      title: '标签',
      dataIndex: 'second_tag',
      key: 'second_tag',
      sorter: (a, b) => a?.second_tag?.localeCompare(b?.second_tag),
      ...columnSearchProps('second_tag'),
    },
    {
      title: '顺序',
      dataIndex: 'order_key',
      key: 'order_key',
      sorter: (a, b) => (a.order_key - b.order_key),
    },
    {
      title: '热推',
      dataIndex: 'is_hot',
      key: 'is_hot',
      render: (v, d) => (
        <>
          <Switch
            key={d.id}
            checked={Boolean(v)}
            onChange={(c) => switchByID(d.id, c)}
          />
        </>
      ),
      shouldCellUpdate: (record, prevRecord) => (record.is_hot !== prevRecord.is_hot),
      sorter: (a, b) => (a.is_hot - b.is_hot),
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      render: (v) => (
        <>
          <Button
            type="dashed"
            size="middle"
          >
            <Popconfirm
              title="确认删除 wiki?"
              onConfirm={() => deleteWiki(v)}
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
            onClick={() => { window.location.href = `/main/wiki/edit/${v}` }}
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
        rowKey={(record) => record.id}
        dataSource={wiki}
        scroll={{
          x: true,
        }}
      />
    </>
  )
}
