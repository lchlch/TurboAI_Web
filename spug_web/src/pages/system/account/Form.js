import React, { useState } from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import { Modal, Form, Select, Input, message } from "antd";
import { http } from "libs";
import store from "./store";
import rStore from "../role/store";

export default observer(function () {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  // const [contacts, setContacts] = useState([])

  // useEffect(() => {
  //   http.get('/api/alarm/contact/?only_push=1')
  //     .then(res => setContacts(res))
  // }, []);

  function handleSubmit() {
    setLoading(true);
    const formData = form.getFieldsValue();
    formData.userId = store.record.userId;
    formData.roleId = localStorage.getItem("roleId");
    let httpMethod = store.isEdit ? http.put : http.post;
    httpMethod("/api/v1/system/user", formData).then(
      () => {
        message.success("操作成功");
        store.formVisible = false;
        store.fetchRecords();
      },
      () => setLoading(false)
    );
  }

  return (
    <Modal
      visible
      width={700}
      maskClosable={false}
      title={store.record.id ? "编辑账户" : "新建账户"}
      onCancel={() => {
        store.formVisible = false;
        store.record = {};
        store.isEdit = false;
      }}
      confirmLoading={loading}
      onOk={handleSubmit}
    >
      <Form
        form={form}
        initialValues={store.record}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
      >
        <Form.Item required name="userName" label="账号">
          <Input placeholder="请输入账号" />
        </Form.Item>
        <Form.Item required name="phonenumber" label="手机号">
          <Input placeholder="请输入手机号" />
        </Form.Item>
        <Form.Item required name="email" label="邮箱">
          <Input placeholder="请输入邮箱" />
        </Form.Item>
        <Form.Item required name="nickName" label="昵称">
          <Input placeholder="请输入昵称" />
        </Form.Item>

        <Form.Item
          required
          hidden={store.isEdit}
          name="password"
          label="密码"
          extra="至少8位包含数字、小写和大写字母。"
        >
          <Input.Password placeholder="请输入密码" />
        </Form.Item>
        <Form.Item
          // hidden={store.record.is_supper}
          label="角色"
          style={{ marginBottom: 0 }}
          required
          name="roleIds"
        >
          <Form.Item
            name="roleIds"
            style={{ display: "inline-block", width: "80%" }}
            // extra="权限最大化原则，组合多个角色权限。"
          >
            <Select mode="multiple" placeholder="请选择角色">
              {rStore.records.map((item) => (
                <Select.Option value={item.roleId} key={item.roleId}>
                  {item.roleName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            style={{
              display: "inline-block",
              width: "20%",
              textAlign: "right",
            }}
          >
            <Link to="/system/role">新建角色</Link>
          </Form.Item>
        </Form.Item>
        {/* <Form.Item
          name="wx_token"
          label="MFA标识"
          extra={(
            <span>
              如果启用了MFA（两步验证）则该项为必填。
              <a target="_blank" rel="noopener noreferrer" href="https://push.TurboAI.cc/guide/TurboAI">如何获取MFA标识？</a>
            </span>)}>
          <Select showSearch allowClear filterOption={(i, o) => includes(o.children, i)}
                  placeholder="请选择绑定推送标识">
            {contacts.map(item => (
              <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
            ))}
          </Select>
        </Form.Item> */}
      </Form>
    </Modal>
  );
});
