import React, { useState } from "react";
import { observer } from "mobx-react";
import { ExclamationCircleOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  message,
  Upload,
  Space,
} from "antd";
import TemplateSelector from "../exec/task/TemplateSelector";
import HostSelector from "pages/host/Selector";
import { LinkButton, ACEditor } from "components";
import { http, cleanCommand } from "libs";
import store from "./store";
import lds from "lodash";

const helpMap = {
  0: "官方镜像只允许管理员操作",
  1: "脚本执行退出状态码为 0 则判定为正常，其他为异常。",
};

export default observer(function () {
  const [loading, setLoading] = useState(false);
  const [showTmp, setShowTmp] = useState(false);

  function handleTest() {
    setLoading(true);
    const formData = lds.pick(store.record, ["type", "targets", "extra"]);
    http
      .post("/api/monitor/test/", formData, { timeout: 120000 })
      .then((res) => {
        if (res.is_success) {
          Modal.success({ content: res.message });
        } else {
          Modal.warning({ content: res.message });
        }
      })
      .finally(() => setLoading(false));
  }

  function handleChangeType(v) {
    store.record.imageType = v;
    store.record.targets = [];
    store.record.extra = undefined;
  }

  function handleAddGroup() {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      title: "添加监控分组",
      content: (
        <Form layout="vertical" style={{ marginTop: 24 }}>
          <Form.Item required label="监控分组">
            <Input onChange={(e) => (store.record.group = e.target.value)} />
          </Form.Item>
        </Form>
      ),
      onOk: () => {
        if (store.record.group) {
          store.groups.push(store.record.group);
        }
      },
    });
  }

  function canNext() {
    const { type, targets, extra, group } = store.record;
    const is_verify = group && targets.length;
    if (["2", "3", "4"].includes(type)) {
      return is_verify && extra;
    } else {
      return is_verify;
    }
  }

  function toNext() {
    // const {type, extra} = store.record;
    // if (!Number(extra) > 0) {
    //   if (type === '1' && extra) return message.error('请输入正确的响应时间')
    //   if (type === '2') return message.error('请输入正确的端口号')
    // }
    store.page += 1;
  }

  function getStyle(t) {
    return t.includes(store.record.type) ? {} : { display: "none" };
  }

  // function handleSubmit() {
  //   setLoading(true);
  //   const formData = form.getFieldsValue();
  //   Object.assign(
  //     formData,
  //     lds.pick(store.record, [
  //       "id",
  //       "name",
  //       "desc",
  //       "targets",
  //       "extra",
  //       "type",
  //       "group",
  //     ])
  //   );
  //   formData["id"] = store.record.id;
  //   http.post("/api/monitor/", formData).then(
  //     () => {
  //       message.success("操作成功");
  //       store.record = {};
  //       store.formVisible = false;
  //       store.fetchRecords();
  //       store.fetchOverviews();
  //     },
  //     () => setLoading(false)
  //   );
  // }

  // const uoloadprops = {
  //   name: "file",
  //   action: "/api/v1/dao/oss/upload",
  //   headers: {
  //     authorization: "authorization-text",
  //   },
  //   onChange(info) {
  //     if (info.file.status !== "uploading") {
  //       console.log(info.file, info.fileList);
  //     }
  //     if (info.file.status === "done") {
  //       message.success(`${info.file.name} file uploaded successfully`);
  //     } else if (info.file.status === "error") {
  //       message.error(`${info.file.name} file upload failed.`);
  //     }
  //   },
  // };

  const [files, setFiles] = useState([]);
  function handleUpload(_, fileList) {
    // const tmp =
    //   files.length > 0 && files[0].type === "upload" ? [...files] : [];
    // for (let file of fileList) {
    //   debugger
    //   tmp.push({
    //     type: "upload",
    //     name: file.name,
    //     path: file,
    //   });
    // }
    setFiles(fileList);
    return Upload.LIST_IGNORE;
  }

  function upload() {
    const formData = new FormData();
    if (files.length === 0) return message.error("请上传镜像");
    for (let index in files) {
      const item = files[index];
      formData.append(`file`, item);
    }
    formData.append(`id`, store.currentId);
    setLoading(true);

    http
      .post("/api/v1/dao/oss/upload", formData, {
        timeout: 600000,
      })
      .then((res) => {
        message.success("操作成功");
        store.record = {};
        store.formVisible = false;
        setLoading(false);
      })
      .finally(() => {
        store.fetchRecords()
        setLoading(false);
      });
  }

  return (
    <Form labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
      <Form.Item required label="上传镜像">
        {/* <Upload {...uoloadprops}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload> */}
        <Upload beforeUpload={handleUpload} fileList={files}>
          <Space className="btn">
            <UploadOutlined />
            Click to Upload
          </Space>
        </Upload>
      </Form.Item>

      <Form.Item wrapperCol={{ span: 14, offset: 6 }} style={{ marginTop: 12 }}>
        <Button type="primary" onClick={upload} loading={loading}>
          提交
        </Button>
        <Button style={{ marginLeft: 20 }} onClick={() => (store.page -= 1)}>
          上一步
        </Button>
        {/* <Button disabled={!canNext()} type="link" loading={loading} onClick={handleTest}>执行测试</Button> */}
        {/* <span style={{color: '#888', fontSize: 12}}>Tips: 仅测试第一个监控地址</span> */}
      </Form.Item>
      {/* {showTmp && <TemplateSelector onOk={({body}) => store.record.extra = body} onCancel={() => setShowTmp(false)}/>} */}
    </Form>
  );
});
