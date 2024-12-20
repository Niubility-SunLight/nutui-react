import React from 'react'
import Taro from '@tarojs/taro'
import { Form, Input, Radio, Picker, Cell } from '@nutui/nutui-react-taro'
import { ArrowRight } from '@nutui/icons-react'

const Demo8 = () => {
  const pickerOptions = [
    { value: 4, text: 'BeiJing' },
    { value: 1, text: 'NanJing' },
    { value: 2, text: 'WuXi' },
    { value: 8, text: 'DaQing' },
    { value: 9, text: 'SuiHua' },
    { value: 10, text: 'WeiFang' },
    { value: 12, text: 'ShiJiaZhuang' },
  ]
  const submitFailed = (error: any) => {
    Taro.showToast({ title: JSON.stringify(error), icon: 'error' })
  }

  const submitSucceed = (values: any) => {
    Taro.showToast({ title: JSON.stringify(values), icon: 'success' })
  }

  const [form] = Form.useForm()
  const usernameWatch = Form.useWatch('username', form)

  const noteWatch = Form.useWatch((values) => {
    return values.picker
  }, form)

  const genderWatch = Form.useWatch((values) => {
    return values.gender
  }, form)

  return (
    <>
      <Form
        form={form}
        onFinish={(values) => submitSucceed(values)}
        onFinishFailed={(values, errors) => submitFailed(errors)}
      >
        <Form.Item
          label="字段A"
          name="username"
          initialValue="默认值"
          rules={[{ required: true, message: '请输入字段A' }]}
        >
          <Input placeholder="请输入字段A" type="text" />
        </Form.Item>
        <Form.Item
          label="Picker"
          name="picker"
          trigger="onConfirm"
          getValueFromEvent={(...args) => args[1]}
          onClick={(event, ref: any) => {
            ref.open()
          }}
        >
          <Picker options={[pickerOptions]}>
            {(value: any) => {
              return (
                <Cell
                  style={{
                    padding: 0,
                    '--nutui-cell-divider-border-bottom': '0',
                  }}
                  className="nutui-cell--clickable"
                  title={
                    value.length
                      ? pickerOptions.filter((po) => po.value === value[0])[0]
                          ?.text
                      : 'Please select'
                  }
                  extra={<ArrowRight />}
                  align="center"
                />
              )
            }}
          </Picker>
        </Form.Item>
        <Form.Item label="字段B" name="gender">
          <Radio.Group>
            <Radio value="male">male</Radio>
            <Radio value="female">female</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
      <Cell>
        <div>字段A：{usernameWatch}</div>
      </Cell>
      <Cell>
        <div>Picker：{noteWatch}</div>
      </Cell>
      <Cell>
        <div>字段B：{genderWatch}</div>
      </Cell>
    </>
  )
}

export default Demo8
