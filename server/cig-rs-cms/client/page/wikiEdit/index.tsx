import React, {
  useState,
  useEffect,
} from 'react'
import moment from 'moment'
import _ from 'lodash'
import {
  Form,
  Input,
  InputNumber,
  Button,
  Upload,
  Switch,
  message,
  Select,
} from 'antd'
import {
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons'

import getAllWiki from '../wiki/getAllWiki'
import putWiki from './putWiki'
import getWikiByID from './getWikiByID'
import getTag from '../wikiAdd/getTag'

moment?.locale('zh-cn')

const {
  Option,
  OptGroup,
} = Select

interface Props {
  match: any,
}

export default (
  {
    match,
  }: Props,
) => {
  const { id } = match.params
  const [filePNG, setFilePNG] = useState([])
  const [filePDF, setFilePDF] = useState([])
  const [percentPDF, setPercentPDF] = useState(0)
  const [wiki, setWiki] = useState(null)
  const [allWiki, setAllWiki] = useState(null)
  const [tag, setTag] = useState([])

  useEffect(async () => {
    const v = await getWikiByID({ id })
    setWiki(v)
    setFilePNG([
      {
        uid: 0,
        name: 0,
        url: v.banner_url,
      },
    ])
    setFilePDF([
      {
        uid: 0,
        name: 'PDF',
        url: v.link_url,
      },
    ])
  }, [id])
  useEffect(async () => setAllWiki(await getAllWiki({})), [])
  useEffect(async () => setTag(await getTag({})), [])

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  }

  const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
  }
  const onFinish = async v => {
    if (allWiki.filter(m => m.is_hot).length >= 10 && v.is_hot) {
      message.error('最多可设置 10 个热推')
      return
    }
    if (v.second_tag.length > 10) {
      message.error('最多选择 10 个标签')
      return
    }
    const opt = {
      id,
      title: v.title,
      author: v.author,
      second_tag: v.second_tag.join('|'),
      banner_url: filePNG[0].url,
      order_key: v.order_key,
      report_level: v.report_level,
      is_hot: v.is_hot ? 1 : 0,
      link_url: filePDF[0].url,
    }
    const rst = await putWiki(opt)
    if (rst.id) {
      message.info('修改成功!')
      window.location.href = '/main/wiki'
    } else {
      message.error('修改失败!')
    }
  }

  return (
    <>
      {
        wiki && tag.length
          ? (
            <Form
              {...layout}
              name="basic"
              initialValues={{
                title: wiki.title,
                author: wiki.author,
                second_tag: wiki.second_tag.split('|'),
                banner_url: wiki.banner_url,
                order_key: wiki.order_key,
                report_level: wiki.report_level,
                is_hot: Boolean(wiki.is_hot),
                link_url: wiki.link_url,
              }}
              onFinish={onFinish}
            >
              <Form.Item
                label="出品人"
                name="author"
                rules={[{ required: true, message: '请添加出品人!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="题目"
                name="title"
                rules={[{ required: true, message: '请填写题目!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="标签"
                name="second_tag"
                rules={[{ required: true, message: '请填写标签!' }]}
              >
                <Select
                  mode="multiple"
                >
                  {
                    _.uniqBy(
                      tag,
                      'first_tag_id',
                    ).map(
                      v => (
                        <>
                          <OptGroup
                            label={v.first_tag_name}
                          >
                            {
                              tag
                                .filter(m => m.first_tag_id === v.first_tag_id)
                                .map(
                                  m => (
                                    <Option
                                      value={m.second_tag_name}
                                    >
                                      {m.second_tag_name}
                                    </Option>
                                  ),
                                )
                            }
                          </OptGroup>
                        </>
                      ),
                    )
                  }
                </Select>
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
                label="可下载等级"
                name="report_level"
                rules={[{ required: true, message: '请选择等级!' }]}
              >
                <Select>
                  <Option value="0">0</Option>
                  <Option value="1">1</Option>
                  <Option value="2">2</Option>
                  <Option value="3">3</Option>
                </Select>
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
                    fileType: 15,
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
                label="PDF"
                name="link_url"
                rules={[{ required: true, message: '请上传文件!' }]}
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
                  data={{ fileType: 20 }}
                  fileList={filePDF}
                  listType="picture-card"
                  beforeUpload={
                    (f) => {
                      if (f.type !== 'application/pdf') {
                        message.error(`${f.name} 不是一个 PDF 文件`)
                      } else if (!f.name.endsWith('.pdf')) {
                        message.error(`${f.name} 文件后缀需小写`)
                      }
                      return f.type === 'application/pdf' && f.name.endsWith('.pdf')
                    }
                  }
                  onChange={
                    (v) => {
                      setPercentPDF(Math.ceil(v?.event?.percent || 0))
                      if (v?.file?.response?.data) {
                        setFilePDF([{
                          uid: 0,
                          name: 'PDF',
                          url: `/${v.file.response.data}`,
                        }])
                        setPercentPDF(0)
                      }
                    }
                  }
                  disabled={Boolean(percentPDF)}
                  onRemove={() => setFilePDF([])}
                  accept="application/pdf"
                >
                  {
                    !filePDF.length
                      ? (
                        <div>
                          <UploadOutlined />
                          <div style={{ marginTop: 8 }}>
                            {
                              percentPDF
                                ? `上传 ${percentPDF}%`
                                : '上传 PDF'
                            }
                          </div>
                        </div>
                      ) : null
                  }
                </Upload>
              </Form.Item>
              <Form.Item
                label="热推"
                name="is_hot"
              >
                <Switch
                  defaultChecked={Boolean(wiki.is_hot)}
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

