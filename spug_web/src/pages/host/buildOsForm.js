import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { Modal, Form, Input, Select, message } from "antd";
import { http } from "libs";
import store from "./store";
// import Typed from "typed.js";
import hljs from "../../highlight";
import "highlight.js/styles/a11y-dark.css";
// import { divide } from "lodash";
// import styles from "./index.module.less";

export default observer(function () {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [log, setLog] = useState();

  setLog('')

  const logRef = React.useRef(null);
  useEffect(() => {
    if (logRef.current) {
      hljs.highlightBlock(logRef.current);
    }
  }, []);

  // React.useEffect(() => {
  //   const typed = new Typed(logRef.current, {
  //     strings: [
  //       "Second test, \nthe last sentence will go back to 'Second test, ', \noh no, this is the third test. ^1000",
  //     ],
  //     typeSpeed: 50,
  //     backSpeed: 0,
  //     // loop: true,
  //   });

  //   return () => {
  //     // Destroy Typed instance during cleanup to stop animation
  //     typed.destroy();
  //   };
  // }, []);

  useEffect(() => {
    setLoading(true);
    http
      .get("/api/v1/server/image/list")
      .then((res) => {
        res.forEach((item) => {
          item.hostId = item.hostId.toString();
        });
        setImageList(res);
      })
      .finally(() => {
        setLoading(false);
      });
    form.setFieldsValue({ username: "root" });
  }, [form]);

  function handleSubmit() {
    if (store.isBuildingOS) {
      console.log("刷新");
    } else {
      console.log("提交装机请求");
      setLoading(true);
      const formData = form.getFieldsValue();
      const hostId = store.curOperationHostInfo.hostId;
      console.log(formData);

      const api = store.buildOsForm === 1 ? "/server/bash/install" : "/server/bash/reinstall";
      http
        .get(`/api/v1/${api}`, { params: { ids: hostId, ...formData } })
        .then((res) => {
          setLoading(true);
          store.buildOsForm = 0
          message.success("提交装机请求,请关注主机状态");
          store.fetchRecords()
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  const info = store.record;
  return (
    <Modal
      visible
      width={700}
      maskClosable={false}
      title={store.buildOsForm === 1 ? "Install OS" : "Reiinstall OS"}
      okText={!store.isBuildingOS ? "confirm" : "refresh"}
      cancelText="close"
      onCancel={() => (store.buildOsForm = 0)}
      confirmLoading={loading}
      onOk={handleSubmit}
    >
      {!store.isBuildingOS ? (
        <Form
          form={form}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 17 }}
          initialValues={info}
        >
          <Form.Item required name="imageId" label="select os image">
            <Select placeholder="select os image">
              {imageList.map((item) => {
                return (
                  <Select.Option value={item.hostId}>
                    {item.imageName}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            required
            name="username"
            label="user"
            tooltip={"root defaulted"}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            required
            name="password"
            label="password"
            tooltip={"root password after install the os"}
          >
            <Input placeholder="please input the root password" />
          </Form.Item>
          <Form.Item name="desc" label="notes">
            <Input.TextArea placeholder="please input the notes" />
          </Form.Item>
        </Form>
      ) : (
        <pre>
          <code id={"javascript"} ref={logRef} style={{ height: "50vh" }}>
            {log}
          </code>
        </pre>
      )}
    </Modal>
  );
});
