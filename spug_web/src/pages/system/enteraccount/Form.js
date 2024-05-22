import React, { useState } from "react";
// import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import { Modal, Form, Input, message } from "antd";
import { http } from "libs";
import store from "./store";
// import rStore from "../role/store";

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
    formData.id = store.record.id;
    formData.tenantId = store.record.tenantId;
    
    let httpMethod = store.isEdit ? http.put : http.post;
    httpMethod("/api/v1/system/tenant", formData)
      .then(() => {
        message.success("操作成功");
        store.formVisible = false;
        store.fetchRecords();
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <Modal
      visible
      width={700}
      maskClosable={false}
      title={store.record.id ? "编辑账户" : "新建账户"}
      onCancel={() => {
        store.formVisible = false;
        store.isEdit = false;
        store.record = {};
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
        <Form.Item required name="companyName" label="企业名">
          <Input placeholder="请输入企业名" />
        </Form.Item>
        <Form.Item required name="contactUserName" label="联系人">
          <Input placeholder="请输入联系人" />
        </Form.Item>
        <Form.Item required name="contactPhone" label="联系电话">
          <Input placeholder="请输入联系电话" />
        </Form.Item>
        {store.isEdit ? (
          ""
        ) : (
          <Form.Item required name="email" label="联系邮箱">
            <Input placeholder="请输入管理员邮箱" />
          </Form.Item>
        )}
        <Form.Item required name="address" label="联系地址">
          <Input placeholder="请输入地址" />
        </Form.Item>
        {store.isEdit ? (
          ""
        ) : (
          <Form.Item required name="username" label="管理员账户">
            <Input placeholder="请输入管理员账户" />
          </Form.Item>
        )}
        <Form.Item required name="domain" label="企业域名">
          <Input placeholder="请输入企业域名" disabled={store.isEdit} />
        </Form.Item>
        {store.isEdit ? (
          ""
        ) : (
          <Form.Item
            required
            hidden={store.record.id}
            name="password"
            label="管理员密码"
            extra="至少8位包含数字、小写和大写字母。"
          >
            <Input.Password placeholder="请输入管理员账户密码" />
          </Form.Item>
        )}
        {/* <Form.Item
          hidden={store.record.is_supper}
          label="角色"
          style={{ marginBottom: 0 }}
        >
          <Form.Item
            name="role_ids"
            style={{ display: "inline-block", width: "80%" }}
            extra="权限最大化原则，组合多个角色权限。"
          >
            <Select mode="multiple" placeholder="请选择">
              {rStore.records.map((item) => (
                <Select.Option value={item.id} key={item.id}>
                  {item.name}
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
        </Form.Item> */}
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
