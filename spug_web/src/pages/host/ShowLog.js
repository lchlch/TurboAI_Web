import React, { useState, useRef, useEffect } from "react";
import { observer } from "mobx-react";
import { Modal, Form, Input, Col, Row, Menu } from "antd";
import hljs from "../../highlight";
import Sync from "./Sync";
import { http } from "libs";
import store from "./store";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import "highlight.js/styles/a11y-dark.css";

export default observer(function () {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState();
  const [range, setRange] = useState("2");
  const [logCmd, setLogCmd] = useState();
  const [token, setToken] = useState();
  const preRef = useRef(null);
  const [code, setCode] = useState();

  useEffect(() => {
    if (preRef.current) {
      hljs.highlightBlock(preRef.current);
    }
  }, [code]);

  const mockLog = {
    1: 
    `    Sat Mar 16 08:20:33 2024 [315] <err> (0x16d963000) analytics_send_passcode_status: AnalyticsEvent: is_set: 1, type: 0, activation_status: 0
    Sat Mar 16 17:35:10 2024 [323] <err> (0x1db585000) MKBDeviceSupportsEnhancedAPFS: dt = -8, bootarg = 0
    Sat Mar 16 17:35:10 2024 [323] <err> (0x16cf77000) data_analytics_init_block_invoke: Checking in for data analytics
    Sat Mar 16 17:35:10 2024 [323] <err> (0x16cf77000) data_analytics_init_block_invoke: set activity criteria
    Sat Mar 16 22:22:51 2024 [323] <err> (0x16cf77000) data_analytics_init_block_invoke: data analytics activity
    Sat Mar 16 22:22:51 2024 [323] <err> (0x16cf77000) analytics_send_kek_stats: AnalyticsEvent: xart_policy: 1, xart_policy_enforced: 0, xart_policy_missing: 0
    Sat Mar 16 22:22:51 2024 [323] <err> (0x16cf77000) analytics_send_kek_stats: AnalyticsEvent: xart_policy: 1, xart_policy_enforced: 0, xart_policy_missing: 0
    Sat Mar 16 22:22:51 2024 [323] <err> (0x16cf77000) dump_fv_blob_state: failed to get blob_state: (e007c013)
    
    Sat Mar 16 22:22:51 2024 [323] <err> (0x16cf77000) analytics_send_passcode_status: AnalyticsEvent: is_set: 1, type: 0, activation_status: 0
    Mon Mar 18 04:16:23 2024 [323] <err> (0x16d003000) data_analytics_init_block_invoke: data analytics activity
    Mon Mar 18 04:16:23 2024 [323] <err> (0x16d003000) analytics_send_kek_stats: AnalyticsEvent: xart_policy: 1, xart_policy_enforced: 0, xart_policy_missing: 0
    Mon Mar 18 04:16:23 2024 [323] <err> (0x16d003000) analytics_send_kek_stats: AnalyticsEvent: xart_policy: 1, xart_policy_enforced: 0, xart_policy_missing: 0
    Mon Mar 18 04:16:23 2024 [323] <err> (0x16d003000) dump_fv_blob_state: failed to get blob_state: (e007c013)
    
    Mon Mar 18 04:16:23 2024 [323] <err> (0x16d003000) analytics_send_passcode_status: AnalyticsEvent: is_set: 1, type: 0, activation_status: 0
    Tue Mar 19 04:36:08 2024 [51204] <err> (0x1db585000) MKBDeviceSupportsEnhancedAPFS: dt = -8, bootarg = 0
    Tue Mar 19 04:36:08 2024 [51204] <err> (0x16d26f000) data_analytics_init_block_invoke: Checking in for data analytics
    Tue Mar 19 04:36:08 2024 [51204] <err> (0x16d26f000) data_analytics_init_block_invoke: activity criteria already set
    Tue Mar 19 04:36:08 2024 [51204] <err> (0x16d1e3000) data_analytics_init_block_invoke: data analytics activity
    Tue Mar 19 04:36:08 2024 [51204] <err> (0x16d1e3000) analytics_send_kek_stats: AnalyticsEvent: xart_policy: 1, xart_policy_enforced: 0, xart_policy_missing: 0
    Tue Mar 19 04:36:08 2024 [51204] <err> (0x16d1e3000) analytics_send_kek_stats: AnalyticsEvent: xart_policy: 1, xart_policy_enforced: 0, xart_policy_missing: 0
    Tue Mar 19 04:36:08 2024 [51204] <err> (0x16d1e3000) dump_fv_blob_state: failed to get blob_state: (e007c013)
    
    Tue Mar 19 04:36:08 2024 [51204] <err> (0x16d1e3000) analytics_send_passcode_status: AnalyticsEvent: is_set: 1, type: 0, activation_status: 0
    Wed Mar 20 04:29:53 2024 [72622] <err> (0x1db585000) MKBDeviceSupportsEnhancedAPFS: dt = -8, bootarg = 0
    Wed Mar 20 04:29:53 2024 [72622] <err> (0x16be2b000) data_analytics_init_block_invoke: Checking in for data analytics
    Wed Mar 20 04:29:53 2024 [72622] <err> (0x16be2b000) data_analytics_init_block_invoke: activity criteria already set
    Wed Mar 20 04:29:53 2024 [72622] <err> (0x16bd9f000) data_analytics_init_block_invoke: data analytics activity
    Wed Mar 20 04:29:53 2024 [72622] <err> (0x16bd9f000) analytics_send_kek_stats: AnalyticsEvent: xart_policy: 1, xart_policy_enforced: 0, xart_policy_missing: 0
    Wed Mar 20 04:29:53 2024 [72622] <err> (0x16bd9f000) analytics_send_kek_stats: AnalyticsEvent: xart_policy: 1, xart_policy_enforced: 0, xart_policy_missing: 0
    Wed Mar 20 04:29:53 2024 [72622] <err> (0x16bd9f000) dump_fv_blob_state: failed to get blob_state: (e007c013)
    Tue Mar 19 04:36:08 2024 [51204] <err> (0x16d1e3000) analytics_send_passcode_status: AnalyticsEvent: is_set: 1, type: 0, activation_status: 0
    Wed Mar 20 04:29:53 2024 [72622] <err> (0x1db585000) MKBDeviceSupportsEnhancedAPFS: dt = -8, bootarg = 0
    Wed Mar 20 04:29:53 2024 [72622] <err> (0x16be2b000) data_analytics_init_block_invoke: Checking in for data analytics
    Wed Mar 20 04:29:53 2024 [72622] <err> (0x16be2b000) data_analytics_init_block_invoke: activity criteria already set
    Wed Mar 20 04:29:53 2024 [72622] <err> (0x16bd9f000) data_analytics_init_block_invoke: data analytics activity
    Wed Mar 20 04:29:53 2024 [72622] <err> (0x16bd9f000) analytics_send_kek_stats: AnalyticsEvent: xart_policy: 1, xart_policy_enforced: 0, xart_policy_missing: 0
    Wed Mar 20 04:29:53 2024 [72622] <err> (0x16bd9f000) analytics_send_kek_stats: AnalyticsEvent: xart_policy: 1, xart_policy_enforced: 0, xart_policy_missing: 0
    Wed Mar 20 04:29:53 2024 [72622] <err> (0x16bd9f000) dump_fv_blob_state: failed to get blob_state: (e007c013)
    Tue Mar 19 04:36:08 2024 [51204] <err> (0x16d1e3000) analytics_send_passcode_status: AnalyticsEvent: is_set: 1, type: 0, activation_status: 0
    Wed Mar 20 04:29:53 2024 [72622] <err> (0x1db585000) MKBDeviceSupportsEnhancedAPFS: dt = -8, bootarg = 0
    Wed Mar 20 04:29:53 2024 [72622] <err> (0x16be2b000) data_analytics_init_block_invoke: Checking in for data analytics
    Wed Mar 20 04:29:53 2024 [72622] <err> (0x16be2b000) data_analytics_init_block_invoke: activity criteria already set
    Wed Mar 20 04:29:53 2024 [72622] <err> (0x16bd9f000) data_analytics_init_block_invoke: data analytics activity
    Wed Mar 20 04:29:53 2024 [72622] <err> (0x16bd9f000) analytics_send_kek_stats: AnalyticsEvent: xart_policy: 1, xart_policy_enforced: 0, xart_policy_missing: 0
    Wed Mar 20 04:29:53 2024 [72622] <err> (0x16bd9f000) analytics_send_kek_stats: AnalyticsEvent: xart_policy: 1, xart_policy_enforced: 0, xart_policy_missing: 0
    Wed Mar 20 04:29:53 2024 [72622] <err> (0x16bd9f000) dump_fv_blob_state: failed to get blob_state: (e007c013)
    `,
  };

  // 
  function handleSubmit() {
    setLoading(true);
    http
      .post("/api/host/valid/", { password, range })
      .then((res) => {
        // setHosts(res.hosts);
        setToken(res.token);
      })
      .finally(() => setLoading(false));
  }

  function handleClose() {
    store.logVisible = false;
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
    getItem("核心日志", "sub1", <MailOutlined />, [
      getItem("内核引导信息日志", "1"),
      getItem("标准系统错误信息日志", "2"),
      getItem("计划任务日志", "3"),
      getItem("安全信息日志", "4"),
    ]),
    getItem("自定义日志", "sub2", <AppstoreOutlined />, [
      getItem("nginx日志", "5"),
      getItem("server日志", "6"),
      getItem("saltsack日志", "7"),
    ]),
  ];
  const App = () => {
    const onClick = (e) => {
      setLogCmd(e.key);
      setCode(mockLog[1]);
    };
    return (
      <Row>
        <Col span={6}>
          <Menu
            onClick={onClick}
            style={{
              width: 256,
            }}
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
            items={items}
          />
        </Col>
        <Col span={18}>
          {
            <pre>
              <code id={"javascript"} ref={preRef} style={{height: "50vh"}}>
                {code}
              </code>
            </pre>
          }
        </Col>
      </Row>
    );
  };

  const unVerifiedLength = store.records.filter((x) => !x.is_verified).length;
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
