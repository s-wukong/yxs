import React, {
  useState,
  useEffect,
} from 'react'
import moment from 'moment'
import {
  Table,
  Input,
  Button,
  DatePicker,
  Popconfirm,
  message,
  Switch,
} from 'antd'

import getAllPublicity from './getAllPublicity'
import putPublicityByID from './putPublicity'
import deletePublicityByID from './deletePublicity'

export default () => {
  const [publicity, setPublicity] = useState(null)

  useEffect(async () => setPublicity(await getAllPublicity({})), [])

  const switchByID = async (opt) => {
    const rst = await putPublicityByID(opt)
    if (rst.id) {
      message.info('更新成功!')
      setPublicity(publicity.map(v => (v.id === rst.id ? { ...v, ...rst } : v)))
    }
  }

  const deletePublicity = async (id) => {
    const rst = await deletePublicityByID({ id })
    if (rst.id) {
      message.info('删除成功!')
      setPublicity(publicity.filter(v => v.id !== rst.id))
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '报告模板',
      dataIndex: 'project_name',
      key: 'project_name',
      render: (v, d) => (
        <>
          <Input
            key={d.id}
            defaultValue={v}
            onPressEnter={(c) => switchByID({ id: d.id, project_name: c.target.value })}
            onBlur={(c) => switchByID({ id: d.id, project_name: c.target.value })}
          />
        </>
      ),
    },
    {
      title: '报告数量',
      dataIndex: 'report_amounts',
      key: 'report_amounts',
      render: (v, d) => (
        <>
          <Input
            key={d.id}
            defaultValue={v}
            onPressEnter={(c) => switchByID({ id: d.id, report_amounts: c.target.value })}
            onBlur={(c) => switchByID({ id: d.id, report_amounts: c.target.value })}
          />
        </>
      ),
    },
    {
      title: '新增数量',
      dataIndex: 'add_amounts',
      key: 'add_amounts',
      render: (v, d) => (
        <>
          <Input
            key={d.id}
            defaultValue={v}
            onPressEnter={(c) => switchByID({ id: d.id, add_amounts: c.target.value })}
            onBlur={(c) => switchByID({ id: d.id, add_amounts: c.target.value })}
          />
        </>
      ),
    },
    {
      title: '热搜字',
      dataIndex: 'hot_search_word',
      key: 'hot_search_word',
      render: (v, d) => (
        <>
          <Input
            key={d.id}
            defaultValue={v}
            onPressEnter={
              (c) => {
                if (c.target.value.split('|').length > 8) {
                  message.error('最多添加 8 个热搜词')
                } else {
                  switchByID({ id: d.id, hot_search_word: c.target.value })
                }
              }
            }
            onBlur={
              (c) => {
                if (c.target.value.split('|').length > 8) {
                  message.error('最多添加 8 个热搜词')
                } else {
                  switchByID({ id: d.id, hot_search_word: c.target.value })
                }
              }
            }
          />
        </>
      ),
    },
    {
      title: '是否使用',
      dataIndex: 'is_use',
      key: 'is_use',
      render: (v, d) => (
        <>
          <Switch
            key={d.id}
            defaultChecked={Boolean(v)}
            onChange={(c) => switchByID({ id: d.id, is_use: c ? 1 : 0 })}
          />
        </>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'upload_time',
      key: 'upload_time',
      render: (t, d) => (
        <>
          {
            t
              ? (
                <DatePicker
                  value={moment(moment(t).format('YYYY-MM'), 'YYYY-MM')}
                  format="YYYY-MM"
                  picker="month"
                  allowClear={false}
                  onChange={
                    (v) => {
                      switchByID({
                        id: d.id,
                        upload_time: moment(v).valueOf(),
                      })
                    }
                  }
                />
              ) : null
          }
        </>
      ),
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
              title="确认删除宣传模板?"
              onConfirm={() => deletePublicity(v)}
              okText="确认"
              cancelText="取消"
            >
              删除
            </Popconfirm>
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
        dataSource={publicity}
      />
    </>
  )
}
