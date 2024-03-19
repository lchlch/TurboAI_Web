import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Modal } from "antd";
import { useTranslation } from "react-i18next";
// import "./i18next";
import {
  UserOutlined,
  LockOutlined,
  // CopyrightOutlined,
  // GithubOutlined,
  MailOutlined,
} from "@ant-design/icons";
import styles from "./login.module.css";
import history from "libs/history";
import { http, updatePermissions } from "libs";
import logo from "layout/logo-TurboAI-white.svg";
import envStore from "pages/config/environment/store";
import appStore from "pages/config/app/store";
import requestStore from "pages/deploy/request/store";
import execStore from "pages/exec/task/store";
import hostStore from "pages/host/store";
// import videoBg from "./bg.mp4";

export default function () {
  const [form] = Form.useForm();
  const [counter, setCounter] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState(
    localStorage.getItem("login_type") || "default"
  );
  const [codeVisible, setCodeVisible] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    envStore.records = [];
    appStore.records = [];
    requestStore.records = [];
    requestStore.deploys = [];
    hostStore.rawRecords = [];
    execStore.hosts = [];
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (counter > 0) {
        setCounter(counter - 1);
      }
    }, 1000);
  }, [counter]);

  function handleSubmit() {
    const formData = form.getFieldsValue();
    if (codeVisible && !formData.captcha) return message.error("请输入验证码");
    setLoading(true);
    formData["type"] = loginType;
    console.log(formData);
    const { username, password } = formData;
    if (username === "admin" && password === "admin") {
      doLogin({
        id: 1,
        access_token: "db0ff8a496b74a9ba3ecea5c3cbbfcfc",
        nickname: "\u7ba1\u7406\u5458",
        is_supper: true,
        has_real_ip: true,
        permissions: [],
      });
      setLoading(false)
    } else {
      setLoading(false)
      message.error("login failed, please check the username and password !")
    }
    // http.post('/api/account/login/', formData)
    //   .then(data => {
    //     if (data['required_mfa']) {
    //       setCodeVisible(true);
    //       setCounter(30);
    //       setLoading(false)
    //     } else if (!data['has_real_ip']) {
    //       Modal.warning({
    //         title: '安全警告',
    //         className: styles.tips,
    //         content: <div>
    //           未能获取到访问者的真实IP，无法提供基于请求来源IP的合法性验证，详细信息请参考
    //           <a target="_blank"
    //              href="https://TurboAI.cc/docs/practice/"
    //              rel="noopener noreferrer">官方文档</a>。
    //         </div>,
    //         onOk: () => doLogin(data)
    //       })
    //     } else {
    //       doLogin(data)
    //     }
    //   }, () => setLoading(false))
  }

  function doLogin(data) {
    localStorage.setItem("id", data["id"]);
    localStorage.setItem("token", data["access_token"]);
    localStorage.setItem("nickname", data["nickname"]);
    localStorage.setItem("is_supper", data["is_supper"]);
    localStorage.setItem("permissions", JSON.stringify(data["permissions"]));
    localStorage.setItem("login_type", loginType);
    updatePermissions();
    if (history.location.state && history.location.state["from"]) {
      history.push(history.location.state["from"]);
    } else {
      history.push("/host");
    }
  }

  function handleCaptcha() {
    setCodeLoading(true);
    const formData = form.getFieldsValue(["username", "password"]);
    formData["type"] = loginType;
    http
      .post("/api/account/login/", formData)
      .then(() => setCounter(30))
      .finally(() => setCodeLoading(false));
  }

  return (
    <div className={styles.container}>
      {/* <video
        src={videoBg}
        autoPlay
        loop
        muted
        style={{
          position: "absolute",
          width: "100vw",
          height: "100vh",
          objectFit: "cover", // 确保视频填充整个容器
        }}
      /> */}
      <div className={styles.containerWrapper}>
        <div className={styles.titleContainer}>
          <div>
            <img className={styles.logo} src={logo} alt="logo" />
          </div>
          <div className={styles.desc}>powerful cloud platform</div>
        </div>
        <div className={styles.formContainer}>
          {/* <Tabs
          activeKey={loginType}
          className={styles.tabs}
          onTabClick={(v) => setLoginType(v)}
        >
          <Tabs.TabPane tab="login" key="default" />
          <Tabs.TabPane tab="LDAP登录" key="ldap"/>
        </Tabs> */}
          <Form form={form}>
            <Form.Item name="username" className={styles.formItem}>
              <Input
                size="large"
                autoComplete="off"
                placeholder={t("userPlaceholder")}
                prefix={<UserOutlined className={styles.icon} />}
              />
            </Form.Item>
            <Form.Item name="password" className={styles.formItem}>
              <Input
                size="large"
                type="password"
                autoComplete="off"
                placeholder={t("pwdPlaceholder")}
                onPressEnter={handleSubmit}
                prefix={<LockOutlined className={styles.icon} />}
              />
            </Form.Item>
            <Form.Item
              hidden={!codeVisible}
              name="captcha"
              className={styles.formItem}
            >
              <div style={{ display: "flex" }}>
                <Form.Item noStyle name="captcha">
                  <Input
                    size="large"
                    autoComplete="off"
                    placeholder="请输入验证码"
                    prefix={<MailOutlined className={styles.icon} />}
                  />
                </Form.Item>
                {counter > 0 ? (
                  <Button disabled size="large" style={{ marginLeft: 8 }}>
                    {counter} 秒后重新获取
                  </Button>
                ) : (
                  <Button
                    size="large"
                    loading={codeLoading}
                    style={{ marginLeft: 8 }}
                    onClick={handleCaptcha}
                  >
                    获取验证码
                  </Button>
                )}
              </div>
            </Form.Item>
          </Form>

          <Button
            block
            size="large"
            type="primary"
            className={styles.button}
            loading={loading}
            onClick={handleSubmit}
          >
            {t("login")}
          </Button>
        </div>
      </div>

      {/* <div className={styles.footerZone}>
        <div className={styles.linksZone}>
          <a
            className={styles.links}
            title="官网"
            href="https://TurboAI.cc"
            target="_blank"
            rel="noopener noreferrer"
          >
            官网
          </a>
          <a
            className={styles.links}
            title="Github"
            href="https://github.com/openTurboAI/TurboAI"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubOutlined />
          </a>
          <a
            title="文档"
            href="https://TurboAI.cc/docs/about-TurboAI/"
            target="_blank"
            rel="noopener noreferrer"
          >
            文档
          </a>
        </div>
        <div style={{ color: "rgba(0, 0, 0, .45)" }}>
          Copyright <CopyrightOutlined /> {new Date().getFullYear()} By
          OpenTurboAI
        </div>
      </div> */}
    </div>
  );
}
