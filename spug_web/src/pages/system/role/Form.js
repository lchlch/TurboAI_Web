import React, { useState } from "react";
import { observer } from "mobx-react";
import { Modal, Form, Input, message, Button } from "antd";
import http from "libs/http";
import { uniqueId } from "libs";
import store from "./store";

export default observer(function () {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  function handleSubmit() {
    setLoading(true);
    const formData = form.getFieldsValue();
    const httpMethod = store.record.roleId ? http.put : http.post;
    formData["roleId"] = store.record.roleId;
    formData.menuIds = Array.from(store.checkedKeys);
    formData.roleKey = uniqueId();
    httpMethod("/api/v1/system/role", formData).then(
      (res) => {
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
      maskClosable={false}
      title={store.record.id ? "编辑角色" : "新建角色"}
      onCancel={() => (store.formVisible = false)}
      confirmLoading={loading}
      onOk={handleSubmit}
    >
      <Form
        form={form}
        initialValues={store.record}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
      >
        <Form.Item required name="roleName" label="角色名称">
          <Input placeholder="请输入角色名称" />
        </Form.Item>
        <Form.Item name="remark" label="备注信息">
          <Input.TextArea placeholder="请输入角色备注信息" />
        </Form.Item>
        <Form.Item name="menuIds" label="添加角色权限">
          <Button onClick={() => store.showPagePerm({}, true)}>权限设置</Button>
          <span style={{ color: "#2563fc", marginLeft: "0.8rem" }}>
            {store.checkedKeys.size > 0
              ? `已选择(${store.checkedKeys.size})`
              : ""}
          </span>
        </Form.Item>
      </Form>
    </Modal>
  );
});
