import React from "react";
import { Layout } from "antd";
import { CopyrightOutlined, GithubOutlined } from "@ant-design/icons";
import styles from "./layout.module.less";
import { useTranslation } from "react-i18next";

export default function () {
  const { t } = useTranslation();
  return (
    <Layout.Footer style={{ padding: 0 }}>
      <div className={styles.footer}>
        <div className={styles.links}>
          {/* <a
            className={styles.item}
            title="官网"
            href="https://turbo-ai.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            官网
          </a> */}
          {/* <a className={styles.item} title="Github" href="https://github.com/openTurboAI/TurboAI" target="_blank"
             rel="noopener noreferrer"><GithubOutlined/></a>
          <a title="文档" href="https://TurboAI.cc/docs/about-TurboAI/" target="_blank"
             rel="noopener noreferrer">文档</a> */}
        </div>
        <div style={{ color: "rgba(0, 0, 0, .45)" }}>
          Copyright <CopyrightOutlined /> {new Date().getFullYear()} By TurboAI
          <a
            className={styles.item}
            title="官网"
            href="https://turbo-ai.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginLeft: 20 }}
          >
            {t("officialWebsite")}
          </a>
        </div>
      </div>
    </Layout.Footer>
  );
}
