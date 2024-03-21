import React, { useState } from "react";
import { observer } from "mobx-react";
import { CloseOutlined, SmileOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Space } from "antd";
import styles from "./index.module.less";
import store from "./store";

export default observer(function () {
  const [isMouseInside, setIsMouseInside] = useState(false);

  const handleMouseEnter = () => {
    setIsMouseInside(true);
  };

  const handleMouseLeave = () => {
    setIsMouseInside(false);
  };

  const goBackTable = () => {
    store.show = 0;
  };

  const onIframeLoad = () => {
    console.log("0000000000000000000")
  }
  return (
    <div
      className={styles.iframeContainer}
      style={{ position: "relative" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isMouseInside && (
        <CloseOutlined
          className={styles.closeIcon}
          onClick={goBackTable}
          style={{
            fontSize: "24px", // 设置图标大小
            color: "#2563fc", // 设置图标颜色
          }}
        />
      )}
      <iframe
        className={styles.iframeGrafana}
        src="http://8.130.51.9:3001/d/9CWBzd1f0bik001/linuxe4b8bb-e69cba-e8afa6-e68385?orgId=1&theme=light&from=1710921676508&to=1711008076508"
        title="file"
        frameBorder={0}
        onLoad={onIframeLoad}
      ></iframe>
    </div>
  );
});
