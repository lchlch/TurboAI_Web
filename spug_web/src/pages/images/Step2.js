import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { UploadOutlined } from "@ant-design/icons";
import { Form, Button, message, Upload, Space } from "antd";
// import TemplateSelector from "../exec/task/TemplateSelector";
// import HostSelector from "pages/host/Selector";
// import { LinkButton, ACEditor } from "components";
import { http } from "libs";
import store from "./store";
// import lds from "lodash";

// const helpMap = {
//   0: "官方镜像只允许管理员操作",
//   1: "脚本执行退出状态码为 0 则判定为正常，其他为异常。",
// };

export default observer(function () {
  const [loading, setLoading] = useState(false);
  // const [fileUrl, setFileUrl] = useState("");
  // const [fileName, setFileName] = useState("");
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (store.isEdit && store?.currentInfo?.s3Path) {
      http
        .get("/api/v1/resource/oss/list", {
          params: { fileName: store?.currentInfo?.s3Path },
        })
        .then((res) => {
          if (Array.isArray(res) && res.length > 0) {
            const { originalName, url } = res[0];
            // setFileUrl(url);
            // setFileName(originalName);
            setFiles([
              {
                name: originalName,
                // status: 'done',
                url: url,
              },
            ]);
            // setFiles({
            //   uid: "1",
            //   name: "xxx.png",
            //   status: "done",
            //   response: "Server Error 500",
            //   // custom error message to show
            //   url: "http://www.baidu.com/xxx.png",
            // });
          }
        });
    }
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

  // function handleChangeType(v) {
  //   store.record.imageType = v;
  //   store.record.targets = [];
  //   store.record.extra = undefined;
  // }

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

  // function toNext() {
  //   // const {type, extra} = store.record;
  //   // if (!Number(extra) > 0) {
  //   //   if (type === '1' && extra) return message.error('请输入正确的响应时间')
  //   //   if (type === '2') return message.error('请输入正确的端口号')
  //   // }
  //   store.page += 1;
  // }

  // function getStyle(t) {
  //   return t.includes(store.record.type) ? {} : { display: "none" };
  // }

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



  function handleRemove(file) {
    setFiles(files.filter((item) => item.name !== file.name));
  }

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
      .post("/api/v1/resource/oss/upload", formData, {
        timeout: 18000000,
      })
      .then((res) => {
        message.success("操作成功");
        store.record = {};
        store.formVisible = false;
        store.resetValue();
        setLoading(false);
      })
      .finally(() => {
        store.fetchRecords();
        setLoading(false);
      });
  }

  return (
    <Form labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
      <Form.Item required label="upload">
        {/* <Upload {...uoloadprops}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload> */}
        <Upload
          beforeUpload={handleUpload}
          fileList={files}
          onRemove={handleRemove}
        >
          <Space className="btn">
            <UploadOutlined />
            Click to Upload
          </Space>
        </Upload>
      </Form.Item>

      <Form.Item wrapperCol={{ span: 14, offset: 6 }} style={{ marginTop: 12 }}>
        <Button type="primary" onClick={upload} loading={loading}>
          submit
        </Button>
        <Button style={{ marginLeft: 20 }} onClick={() => (store.page -= 1)}>
          previous step
        </Button>
        {/* <Button disabled={!canNext()} type="link" loading={loading} onClick={handleTest}>执行测试</Button> */}
        {/* <span style={{color: '#888', fontSize: 12}}>Tips: 仅测试第一个监控地址</span> */}
      </Form.Item>
      {/* {showTmp && <TemplateSelector onOk={({body}) => store.record.extra = body} onCancel={() => setShowTmp(false)}/>} */}
    </Form>
  );
});
