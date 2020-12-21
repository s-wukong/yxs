import React from 'react'
import moment from 'moment'
import {
  Form,
  Input,
  InputNumber,
  Button,
  DatePicker,
  Switch,
  message,
} from 'antd'

import addPublicity from './addPublicity'

moment?.locale('zh-cn')

export default () => {
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  }

  const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
  }
  const onFinish = async v => {
    if (v.hot_search_word.split('|').length > 8) {
      message.error('最多添加 8 个热搜词')
      return
    }
    const opt = {
      title: v.title,
      project_name: v.project_name,
      report_amounts: v.report_amounts,
      upload_time: moment(v.upload_time).valueOf(),
      add_amounts: v.add_amounts,
      hot_search_word: v.hot_search_word,
      is_use: v.is_use ? 1 : 0,
    }
    const rst = await addPublicity(opt)
    if (rst.id) {
      message.info('添加成功!')
      window.location.href = '/main/publicity'
    } else {
      message.error('添加失败!')
    }
  }

  return (
    <Form
      {...layout}
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item
        label="宣传模板"
        name="project_name"
        rules={[{ required: true, message: '请添加宣传模板!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="报告数"
        name="report_amounts"
        rules={[{ required: true, message: '请填写报告数!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="更新时间"
        name="upload_time"
        rules={[{ required: true, message: '请选择时间!' }]}
      >
        <DatePicker
          format="YYYY-MM"
          picker="month"
        />
      </Form.Item>
      <Form.Item
        label="新增报告"
        name="add_amounts"
        rules={[{ required: true, message: '请填写新增报告数!' }]}
      >
        <InputNumber
          style={{
            width: '100%',
          }}
        />
      </Form.Item>
      <Form.Item
        label="热搜词"
        name="hot_search_word"
        rules={[{ required: true, message: '请填写热搜词!' }]}
      >
        <Input
          placeholder="热搜词用'|'间隔，最多 8 个"
          onChange={
            (v) => {
              if (v.target.value.split('|').length > 8) {
                message.error('最多添加 8 个热搜词')
              }
            }
          }
        />
      </Form.Item>
      <Form.Item
        label="是否使用"
        name="is_use"
      >
        <Switch
          defaultChecked={false}
        />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          确定
        </Button>
      </Form.Item>
    </Form>
  )
}

