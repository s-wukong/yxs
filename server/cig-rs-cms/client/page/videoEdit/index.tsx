import React, {
  useState,
  useEffect,
} from 'react'
import moment from 'moment'
import {
  Form,
  Input,
  InputNumber,
  Button,
  DatePicker,
  Upload,
  Switch,
  message,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import getVideo from './getVideoByID'
import putVideo from './putVideo'

moment?.locale('zh-cn')

interface Props {
  match: any,
}

export default (
  {
    match,
  }: Props,
) => {
  const [filePNG, setFilePNG] = useState([])
  const [video, setVideo] = useState(null)
  const { id } = match.params

  useEffect(async () => {
    const v = await getVideo({ video_id: id })
    setVideo(v)
    setFilePNG([
      {
        uid: 0,
        name: 0,
        url: v.banner_url,
      },
    ])
  }, [id])

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  }

  const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
  }

  const onFinish = async v => {
    const opt = {
      video_id: id,
      banner_url: filePNG[0].url,
      speaker: v.speaker,
      synopsis: v.synopsis,
      duration: v.duration,
      title: v.title,
      video_link: v.video_link,
      order_key: v.order_key,
      is_hot: v.is_hot ? 1 : 0,
      upload_time: moment(v.upload_time).valueOf(),
    }
    const rst = await putVideo(opt)
    if (rst.video_id) {
      message.info('修改成功!')
      window.location.href = '/main/video'
    } else {
      message.error('修改失败!')
    }
  }

  return (
    <>
      {
        video
          ? (
            <Form
              {...layout}
              name="basic"
              initialValues={{
                banner_url: video.banner_url,
                speaker: video.speaker,
                title: video.title,
                synopsis: video.synopsis,
                video_link: video.video_link,
                duration: video.duration,
                order_key: video.order_key,
                upload_time: moment(
                  moment(video.upload_time).format('YYYY-MM-DD HH:mm:ss'),
                  'YYYY-MM-DD HH:mm:ss',
                ),
                is_hot: Boolean(video.is_hot),
              }}
              onFinish={onFinish}
            >
              <Form.Item
                label="主讲人"
                name="speaker"
                rules={[{ required: true, message: '请添加主讲人!' }]}
              >
                <Input
                  type="text"
                />
              </Form.Item>
              <Form.Item
                label="课题"
                name="title"
                rules={[{ required: true, message: '请填写课题!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="简介"
                name="synopsis"
                rules={[{ required: true, message: '请填写课题!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="视频链接"
                name="video_link"
                rules={[{ required: true, message: '请填写课题!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="视频时长"
                name="duration"
                rules={[{ required: true, message: '请填写课题!' }]}
              >
                <InputNumber
                  style={{
                    width: '100%',
                  }}
                />
              </Form.Item>
              <Form.Item
                label="顺序"
                name="order_key"
                rules={[{ required: true, message: '请填写课题!' }]}
              >
                <InputNumber
                  style={{
                    width: '100%',
                  }}
                />
              </Form.Item>
              <Form.Item
                label="发布时间"
                name="upload_time"
                rules={[{ required: true, message: '请选择时间!' }]}
              >
                <DatePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                />
              </Form.Item>
              <Form.Item
                label="Banner"
                name="banner_url"
                rules={[{ required: true, message: '请上传 Banner!' }]}
                getValueFromEvent={
                  (e) => {
                    if (Array.isArray(e)) return e
                    return e && e.fileList
                  }
                }
              >
                <Upload
                  action="/api/upload"
                  name="file"
                  data={{
                    fileType: 10,
                  }}
                  fileList={filePNG}
                  listType="picture-card"
                  beforeUpload={
                    (f) => {
                      if (f.type !== 'image/png') {
                        message.error(`${f.name} 不是 PNG 图片`)
                      } else if (!f.name.endsWith('.png')) {
                        message.error(`${f.name} 文件后缀需小写`)
                      }
                      return f.type === 'image/png' && f.name.endsWith('.png')
                    }
                  }
                  onChange={
                    (v) => {
                      if (v?.file?.response?.data) {
                        setFilePNG([{
                          uid: 0,
                          name: 0,
                          url: `/${v.file.response.data}`,
                        }])
                      }
                    }
                  }
                  onRemove={() => setFilePNG([])}
                  accept="image/png"
                >
                  {
                    !filePNG.length
                      ? (
                        <div>
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                      ) : null
                  }
                </Upload>
              </Form.Item>
              <Form.Item
                label="热点"
                name="is_hot"
              >
                <Switch
                  defaultChecked={Boolean(video.is_hot)}
                />
              </Form.Item>

              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                  确定
                </Button>
              </Form.Item>
            </Form>
          ) : null
      }
    </>
  )
}

