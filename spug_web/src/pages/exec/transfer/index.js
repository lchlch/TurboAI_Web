import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import {
  ThunderboltOutlined,
  UploadOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import {
  Form,
  Button,
  Tooltip,
  Space,
  Card,
  Table,
  Input,
  Upload,
  message,
} from "antd";
import { AuthDiv, Breadcrumb } from "components";
import HostSelector from "pages/host/Selector";
import Output from "./Output";
import { http, uniqueId } from "libs";
// import moment from "moment";
import store from "./store";
import style from "./index.module.less";

import hljs from "../../../highlight";
import "highlight.js/styles/a11y-dark.css";

function TransferIndex() {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [dir, setDir] = useState("");
  const [hosts, setHosts] = useState([]);
  const [percent, setPercent] = useState();
  const [token, setToken] = useState();
  // const [histories, setHistories] = useState([]);
  const [response, setResponse] = useState([]);

  const logRef = React.useRef(null);
  useEffect(() => {
    if (logRef.current) {
      hljs.highlightBlock(logRef.current);
    }
  }, []);

  useEffect(() => {
    // setHistories([]);
  }, [loading]);

  function _handleProgress(e) {
    const data = (e.loaded / e.total) * 100;
    if (!percent && data === 100) return;
    setPercent(String(data).replace(/(\d+\.\d).*/, "$1"));
  }

  function upload2Oss() {
    const formData = new FormData();
    if (files.length === 0) return message.error("请上传镜像");
    for (let index in files) {
      const item = files[index];
      formData.append(`file`, item.path);
    }
    // formData.append(`id`, store.currentId);
    setLoading(true);
    return http
      .post("/api/v1/resource/oss/upload", formData, {
        timeout: 600000,
      })
      .then((res) => {
        setLoading(false);
        return res.url;
      })
      .finally(() => {
        // store.fetchRecords();
        setLoading(false);
      });
  }

  function handleSubmit() {
    // const formData = new FormData();
    // if (files.length === 0) return message.error("请添加数据源");
    if (!dir) return message.error("请输入目标路径");
    if (hosts.length === 0) return message.error("请选择目标主机");
    const fileNames = files[0].name;
    const data = { path: dir, ids: hosts.join(","), fileNames };
    // for (let index in files) {
    //   const item = files[index];
    //   if (item.type === "host") {
    //     data.host = JSON.stringify([item.host_id, item.path]);
    //   } else {
    //     formData.append(`file${index}`, item.path);
    //   }
    // }
    // formData.append("data", JSON.stringify(data));
    setLoading(true);
    upload2Oss().then((url) => {
      setLoading(true);
      http
        .get(
          "/api/v1/server/bash/download2path",
          { params: { ...data, urls: url } },
          {
            timeout: 600000,
            onUploadProgress: _handleProgress,
          }
        )
        .then((res) => {
          message.success("分发成功");
          if (res?.output) {
            setResponse(res.output.split(/\r?\n/));
          }

          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
          setPercent();
        });
    });
  }

  // function makeFile(row) {
  //   setFiles([
  //     {
  //       id: uniqueId(),
  //       type: "host",
  //       name: row.name,
  //       path: "",
  //       host_id: row.id,
  //     },
  //   ]);
  // }

  function handleUpload(_, fileList) {
    const tmp =
      files.length > 0 && files[0].type === "upload" ? [...files] : [];
    for (let file of fileList) {
      tmp.push({
        id: uniqueId(),
        type: "upload",
        name: file.name,
        path: file,
      });
    }
    // setFiles(tmp);
    setFiles(tmp.slice(-1));
    return Upload.LIST_IGNORE;
  }

  function handleRemove(index) {
    files.splice(index, 1);
    setFiles([...files]);
  }

  function handleCloseOutput() {
    setToken();
    if (!store.counter["0"] && !store.counter["2"]) {
      setFiles([]);
    }
  }
  // const props = {
  //   name: "file",
  //   action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
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

  return (
    <AuthDiv auth="run">
      <Breadcrumb>
        <Breadcrumb.Item>homepage</Breadcrumb.Item>
        <Breadcrumb.Item>batch execution</Breadcrumb.Item>
        <Breadcrumb.Item>file distribution</Breadcrumb.Item>
      </Breadcrumb>
      <div className={style.index}>
        <div className={style.left}>
          <Card
            type="inner"
            title={`source files${files.length ? `（${files.length}）` : ""}`}
            extra={
              <Space size={24}>
                <Upload multiple beforeUpload={handleUpload}>
                  <Space className="btn">
                    <UploadOutlined />
                    upload
                  </Space>
                </Upload>
                {/* <HostSelector onlyOne mode="rows" onChange={row => makeFile(row)}>
            <Space className="btn"><CloudServerOutlined/>添加主机文件</Space>
          </HostSelector> */}
              </Space>
            }
          >
            <Table
              rowKey="id"
              className={style.table}
              showHeader={false}
              pagination={false}
              size="small"
              dataSource={files}
            >
              <Table.Column title="文件来源" dataIndex="name" />
              <Table.Column
                title="文件名称/路径"
                render={(info) =>
                  info.type === "upload" ? (
                    info.path.name
                  ) : (
                    <Input
                      onChange={(e) => (info.path = e.target.value)}
                      placeholder="请输入要同步的目录路径"
                    />
                  )
                }
              />
              <Table.Column
                title="操作"
                render={(_, __, index) => (
                  <Button
                    danger
                    type="link"
                    onClick={() => handleRemove(index)}
                  >
                    remove
                  </Button>
                )}
              />
            </Table>
          </Card>
          <Card
            type="inner"
            title="target hosts"
            style={{ margin: "24px 0" }}
            bodyStyle={{ paddingBottom: 0 }}
            extra={
              <Tooltip
                className={style.tips}
                title="如需安装依赖请使用批量执行功能"
              >
                <BulbOutlined /> 小提示
              </Tooltip>
            }
          >
            <Form>
              <Form.Item required label="target route">
                <Input
                  value={dir}
                  onChange={(e) => setDir(e.target.value)}
                  placeholder="target route"
                />
              </Form.Item>
              <Form.Item required label="target hosts">
                <HostSelector
                  type="button"
                  mode="ids"
                  value={hosts.map((x) => x.id)}
                  onChange={(rows) => setHosts(rows)}
                />
              </Form.Item>
            </Form>
          </Card>

          <Button
            loading={loading}
            icon={<ThunderboltOutlined />}
            type="primary"
            onClick={() => handleSubmit()}
          >
            {percent ? `uploading ${percent}%` : "start"}
          </Button>
        </div>

        <div className={style.right}>
          <div className={style.title}>results</div>
          <div className={style.inner}>
            <pre>
              <code id={"javascript"} ref={logRef} style={{ height: "620px" }}>
                {response.map((item, index) => (
                  <p>{item}</p>
                ))}
              </code>
            </pre>
          </div>
        </div>
      </div>
      {token ? <Output token={token} onBack={handleCloseOutput} /> : null}
    </AuthDiv>
  );
}

export default observer(TransferIndex);
