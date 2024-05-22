import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
// import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  // Modal,
  Form,
  Input,
  Select,
  Button,
  // message,
  // Upload,
  // Space,
} from "antd";
// import TemplateSelector from "../exec/task/TemplateSelector";
// import HostSelector from "pages/host/Selector";
// import { LinkButton, ACEditor } from "components";
import { http } from "libs";
import store from "./store";
// import lds from "lodash";

const helpMap = {
  0: "官方镜像只允许管理员操作",
  1: "脚本执行退出状态码为 0 则判定为正常，其他为异常。",
};

export default observer(function () {
  const [loading, setLoading] = useState(false);
  const [imageReleaseDic, setImageReleaseDic] = useState([]);

  useEffect(() => {
    http
      .get(
        "/api/v1/system/dictData/list",
        { params: { dictType: "server_image_type" } },
        { timeout: 120000 }
      )
      .then((res) => {
        let dicArray = res.map((item) => ({
          label: item.dictLabel,
          value: item.dictValue,
        }));
        setImageReleaseDic(dicArray);
      })
      .finally(() => setLoading(false));
  }, []);

  // function handleTest() {
  //   setLoading(true);
  //   const formData = lds.pick(store.record, ["type", "targets", "extra"]);
  //   http
  //     .post("/api/monitor/test/", formData, { timeout: 120000 })
  //     .then((res) => {
  //       if (res.is_success) {
  //         Modal.success({ content: res.message });
  //       } else {
  //         Modal.warning({ content: res.message });
  //       }
  //     })
  //     .finally(() => setLoading(false));
  // }

  function handleChangeType(v) {
    store.record.imageType = v;
    store.record.targets = [];
    store.record.extra = undefined;
  }

  function handleChangeLinuxType(v) {
    store.record.imageRelease = v;
  }

  // function handleAddGroup() {
  //   Modal.confirm({
  //     icon: <ExclamationCircleOutlined />,
  //     title: "添加监控分组",
  //     content: (
  //       <Form layout="vertical" style={{ marginTop: 24 }}>
  //         <Form.Item required label="监控分组">
  //           <Input onChange={(e) => (store.record.group = e.target.value)} />
  //         </Form.Item>
  //       </Form>
  //     ),
  //     onOk: () => {
  //       if (store.record.group) {
  //         store.groups.push(store.record.group);
  //       }
  //     },
  //   });
  // }

  // function canNext() {
  //   const { type, targets, extra, group } = store.record;
  //   const is_verify = group && targets.length;
  //   if (["2", "3", "4"].includes(type)) {
  //     return is_verify && extra;
  //   } else {
  //     return is_verify;
  //   }
  // }

  function toNext() {
    // const {type, extra} = store.record;
    // if (!Number(extra) > 0) {
    //   if (type === '1' && extra) return message.error('请输入正确的响应时间')
    //   if (type === '2') return message.error('请输入正确的端口号')
    // }
    setLoading(true);
    store.toNext().finally(() => {
      setLoading(false);
    });
  }

  // function getStyle(t) {
  //   return t.includes(store.record.type) ? {} : { display: "none" };
  // }

  const {
    imageName,
    imageRelease: linuxType = 0,
    imageVersion,
    coreVersion,
    imageType,
    remark,
    // id,
  } = store.record;
  return (
    <Form labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
      <Form.Item required label="image name">
        <Input
          value={imageName}
          onChange={(e) => (store.record.imageName = e.target.value)}
          placeholder="please input image name"
        />
      </Form.Item>
      {/* <Form.Item required label="linux版本">
        <Input
          value={imageRelease}
          onChange={(e) => (store.record.imageRelease = e.target.value)}
          placeholder="e.g ubuntu/centos.."
        />
      </Form.Item> */}

      <Form.Item label="linux">
        <Select
          placeholder="please select linux"
          value={String(linuxType)}
          onChange={handleChangeLinuxType}
        >
          {imageReleaseDic.map((item) => {
            return (
              <Select.Option value={item.value}>{item.label}</Select.Option>
            );
          })}
          {/* <Select.Option value="0">官方镜像</Select.Option>
          <Select.Option value="1">自定义镜像</Select.Option> */}
        </Select>
      </Form.Item>

      <Form.Item required label="image version">
        <Input
          value={imageVersion}
          onChange={(e) => (store.record.imageVersion = e.target.value)}
          placeholder="e.g CentOS-7-x86_64-Minimal-2009.iso..."
        />
      </Form.Item>
      <Form.Item required label="os core version">
        <Input
          value={coreVersion}
          onChange={(e) => (store.record.coreVersion = e.target.value)}
          placeholder="e.g 4.18.0-305.25.1.el8_4.x86_64..."
        />
      </Form.Item>
      <Form.Item label="image type" tooltip={helpMap[0]}>
        <Select
          placeholder="please select"
          value={imageType}
          onChange={handleChangeType}
        >
          <Select.Option value="0">official</Select.Option>
          <Select.Option value="1">private</Select.Option>
        </Select>
      </Form.Item>
      {/* <Form.Item required label="上传镜像">
        <Upload {...uoloadprops}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Form.Item> */}
      <Form.Item label="notes">
        <Input.TextArea
          value={remark}
          onChange={(e) => (store.record.remark = e.target.value)}
          placeholder="please input"
        />
      </Form.Item>

      <Form.Item wrapperCol={{ span: 14, offset: 6 }} style={{ marginTop: 12 }}>
        <Button type="primary" onClick={toNext} loading={loading}>
          next
        </Button>
        {/* <Button disabled={!canNext()} type="link" loading={loading} onClick={handleTest}>执行测试</Button> */}
        {/* <span style={{color: '#888', fontSize: 12}}>Tips: 仅测试第一个监控地址</span> */}
      </Form.Item>
      {/* {showTmp && <TemplateSelector onOk={({body}) => store.record.extra = body} onCancel={() => setShowTmp(false)}/>} */}
    </Form>
  );
});
