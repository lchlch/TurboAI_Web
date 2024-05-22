import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { Modal,Spin, Col, Row, Menu, Button } from "antd";
// import Sync from "./Sync";
import { http } from "libs";
import store from "./store";
import {
  AppstoreOutlined,
  MailOutlined,
  // SettingOutlined,
} from "@ant-design/icons";
import hljs from "../../highlight";
import "highlight.js/styles/a11y-dark.css";
// import { divide } from "lodash";

export default observer(function () {      
  const [loading, setLoading] = useState(false);
  const [downloadloading, setDownloadLoading] = useState(false);
  // const [password, setPassword] = useState();
  // const [range, setRange] = useState("2");
  // const [logCmd, setLogCmd] = useState();
  // const [token, setToken] = useState();
  const [code, setCode] = useState();
  const [logId, setLogId] = useState("15");

  const preRef = React.useRef(null);
  useEffect(() => {
    if (preRef.current) {
      hljs.highlightBlock(preRef.current);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    http
      .get("/api/v1/server/bash/logs", {
        params: { dictCode: logId, ids: store.curOperationHostInfo.hostId },
      })
      .then((res) => {
        // setHosts(res.hosts);
        if (res && res.length > 0) {
          setCode(res[0].logs.join("\n"));
        } else {
          setCode("");
        }
      })
      .finally(() => setLoading(false));
  }, [logId]);

  // useEffect(() => {

  // }, [logId]);

  //
  // function handleSubmit() {
  //   setLoading(true);
  //   http
  //     .post("/api/host/valid/", { password, range })
  //     .then((res) => {
  //       // setHosts(res.hosts);
  //       setToken(res.token);
  //     })
  //     .finally(() => setLoading(false));
  // }

  function handleClose() {
    store.logVisible = false;
  }

  function downloadLog() {
    setDownloadLoading(true);
    http
      .get(
        "api/v1/server/bash/logs/download",
        {
          params: { dictCode: logId, ids: store.curOperationHostInfo.hostId },
        },
        { responseType: "blob" }
      )
      .then((res) => {
        const blob = new Blob([res], {
          type: "text/plain",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "log.txt";
        document.body.appendChild(link);
        link.click();
      })
      .finally(() => setDownloadLoading(false));
  }

  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }
  const items = [
    getItem("core logs", "sub1", <MailOutlined />, [
      getItem("log/dmesg", "14"),
      getItem("log/messages", "15"),
      getItem("log/cron", "16"),
      getItem("log/secure", "17"),
    ]),
    getItem("private task logs", "sub2", <AppstoreOutlined />, [
      getItem("nginx logs", "5"),
      getItem("server logs", "6"),
      getItem("saltsack logs", "7"),
    ]),
  ];
  const App = () => {
    const onClick = (e) => {
      setLogId(e.key);
      // setCode(mockLog[1]);
    };
    return (
      <Row>
        <Col span={6}>
          <Menu
            onClick={onClick}
            style={{
              width: 256,
            }}
            defaultSelectedKeys={["15"]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
            items={items}
            selectedKeys={logId}
          />
        </Col>
        <Col span={18}>
          {
            <div
              style={{ height: "50vh", overflow: "auto", position: "relative" }}
            >
              <Button
                type="primary"
                size="small"
                onClick={() => downloadLog()}
                style={{ position: "absolute", right: "0px", top: "0px" }}
                loading={downloadloading}
              >
                download
              </Button>
              {loading && (
                <Spin
                  style={{ position: "absolute", right: "45%", top: "40%" }}
                />
              )}

              <pre>
                <code id={"javascript"} ref={preRef}>
                  {code}
                </code>
              </pre>
            </div>
          }
        </Col>
      </Row>
    );
  };

  // const unVerifiedLength = store.records.filter((x) => !x.is_verified).length;
  return (
    <Modal
      visible
      maskClosable={false}
      title="查看日志"
      okText="关闭"
      onCancel={handleClose}
      width={"70%"}
      footer={null}
    >
      <App></App>
    </Modal>
  );
});
