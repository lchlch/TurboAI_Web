import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import {
  Modal,
  Form,
  Input,
  Select,
} from "antd";
import { http } from "libs";
import store from "./store";

export default observer(function () {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageList, setImageList] = useState([]);

  useEffect(() => {
    setLoading(true);
    http
      .get("/api/v1/dao/imageList/list")
      .then((res) => {
        res.forEach((item) => {
          item.id = item.id.toString();
        });
        setImageList(res);
      })
      .finally(() => {
        setLoading(false);
      });
      form.setFieldsValue({ username: 'root' });
  }, []);

  function handleSubmit() {
    setLoading(true);
    const formData = form.getFieldsValue();
    console.log(formData)
    // const request = store.isEdit ? http.put : http.post;

    // const data = store.isEdit
    //   ? { ...store.record, ...formData }
    //   : { ...formData };
    // return request("/api/v1/dao/hostList", { ...data }).then((res) => {
    //   setLoading(true);
    //   message.success("新增成功");
    //   store.formVisible = false;
    // });
  }

  const info = store.record;
  return (
    <Modal
      visible
      width={700}
      maskClosable={false}
      title={store.buildOsForm === 1 ? "安装系统" : "系统重装"}
      okText="确定"
      onCancel={() => (store.buildOsForm = 0)}
      confirmLoading={loading}
      onOk={handleSubmit}
    >
      <Form
        form={form}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 17 }}
        initialValues={info}
      >
        <Form.Item required name="image" label="选择要安装的镜像">
          <Select placeholder="请选择镜像">
            {imageList.map((item) => {
              return (
                <Select.Option value={item.id}>{item.imageName}</Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item required name="username" label="用户" tooltip={"默认root用户"}>
          <Input disabled />
        </Form.Item>
        <Form.Item required name="password" label="密码" tooltip={"安装系统后的默认root密码，请仔细核对"}>
          <Input placeholder="请输入root默认密码"/>
        </Form.Item>
        <Form.Item name="desc" label="备注信息">
          <Input.TextArea placeholder="请输入备注信息" />
        </Form.Item>
      </Form>
    </Modal>
  );
});
