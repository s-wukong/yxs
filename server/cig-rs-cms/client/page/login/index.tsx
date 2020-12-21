import React from 'react'
import {
  Form,
  Input,
  Button,
  message,
} from 'antd'

import r from 'tool/request'

export default () => {
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  }

  const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
  }

  const onFinish = async v => {
    const rst = await r(
      '/api/login',
      {
        username: v.username,
        password: v.password,
      },
    )
    if (rst.data) {
      message.info('登录成功')
      window.location.href = '/main/user'
    } else {
      message.error(rst.msg || '网络错误')
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        width: '400px',
        height: '200px',
        margin: '-100px 0 0 -200px',
      }}
    >
      <Form
        {...layout}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          label="账号"
          name="username"
          rules={[{ required: true, message: '请输入账号!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button
            type="primary"
            htmlType="submit"
          >
            确定
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
