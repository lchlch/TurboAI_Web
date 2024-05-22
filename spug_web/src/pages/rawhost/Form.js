import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
// import { ExclamationCircleOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Modal,
  Form,
  Input,
  // TreeSelect,
  // Button,
  // Upload,
  // Alert,
  message,
} from "antd";
import { http } from "libs";
import store from "./store";
// import styles from "./index.module.less";
import { v4 as uuidv4 } from "uuid";

export default observer(function () {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  // const [uploading, setUploading] = useState(false);
  // const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (store.record.pkey) {
      // setFileList([{ uid: "0", name: "独立密钥", data: store.record.pkey }]);
    }
  }, []);


  function handleSubmit() {
    setLoading(true);
    const formData = form.getFieldsValue();
    const uuid = uuidv4();
    const request = store.isEdit ? http.put : http.post;

    const data = store.isEdit
      ? { ...store.record, ...formData }
      : { ...formData, uuid };
    return request("/api/v1/server/host", { ...data }).then((res) => {
      setLoading(true);
      message.success("add success");
      store.formVisible = false;
      store.fetchRecords();
      // store.fetchExtend(res.hostId)
    });
  }

  // const ConfirmForm = (props) => (
  //   <Form layout="vertical" style={{ marginTop: 24 }}>
  //     <Form.Item
  //       required
  //       label="授权密码"
  //       extra={`用户 ${props.username} 的密码， 该密码仅做首次验证使用，不会存储该密码。`}
  //     >
  //       <Input.Password onChange={(e) => props.onChange(e.target.value)} />
  //     </Form.Item>
  //   </Form>
  // );

  // function handleUploadChange(v) {
  //   if (v.fileList.length === 0) {
  //     setFileList([]);
  //   }
  // }

  // function handleUpload(file, fileList) {
  //   setUploading(true);
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   http
  //     .post("/api/host/parse/", formData)
  //     .then((res) => {
  //       file.data = res;
  //       setFileList([file]);
  //     })
  //     .finally(() => setUploading(false));
  //   return false;
  // }

  const info = store.record;
  return (
    <Modal
      visible
      width={700}
      maskClosable={false}
      title={store.record.hostId ? "host edition" : "add host"}
      okText="new"
      onCancel={() => (store.formVisible = false)}
      confirmLoading={loading}
      onOk={handleSubmit}
    >
      <Form
        form={form}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 17 }}
        initialValues={info}
      >
        {/* <Form.Item required name="group_ids" label="主机分组">
          <TreeSelect
            multiple
            treeNodeLabelProp="name"
            treeData={store.treeData}
            showCheckedStrategy={TreeSelect.SHOW_CHILD}
            placeholder="请选择分组"/>
        </Form.Item> */}
        <Form.Item required name="hostName" label="host name">
          <Input placeholder="please input host name" />
        </Form.Item>
        <Form.Item required name="mac" label="mac">
          <Input placeholder="please input mac" />
        </Form.Item>
        {/* <Form.Item required label="连接地址" style={{marginBottom: 0}}>
          <Form.Item name="username" className={styles.formAddress1} style={{width: 'calc(30%)'}}>
            <Input addonBefore="ssh" placeholder="用户名"/>
          </Form.Item>
          <Form.Item name="hostname" className={styles.formAddress2} style={{width: 'calc(40%)'}}>
            <Input addonBefore="@" placeholder="主机名/IP"/>
          </Form.Item>
          <Form.Item name="port" className={styles.formAddress3} style={{width: 'calc(30%)'}}>
            <Input addonBefore="-p" placeholder="端口"/>
          </Form.Item>
        </Form.Item> */}
        {/* <Form.Item label="独立密钥" extra="默认使用全局密钥，如果上传了独立密钥（私钥）则优先使用该密钥。">
          <Upload name="file" fileList={fileList} headers={{'X-Token': X_TOKEN}} beforeUpload={handleUpload}
                  onChange={handleUploadChange}>
            {fileList.length === 0 ? <Button loading={uploading} icon={<UploadOutlined/>}>点击上传</Button> : null}
          </Upload>
        </Form.Item> */}
        <Form.Item name="desc" label="notes">
          <Input.TextArea placeholder="please input notes" />
        </Form.Item>
        {/* <Form.Item wrapperCol={{span: 17, offset: 5}}>
          <Alert showIcon type="info" message="首次验证时需要输入登录用户名对应的密码，该密码会用于配置SSH密钥认证，不会存储该密码。"/>
        </Form.Item> */}
      </Form>
    </Modal>
  );
});
