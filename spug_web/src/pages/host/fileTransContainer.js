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
        className={styles.iframe}
        src="http://111.229.95.48:9991/"
        title="file"
        frameBorder={0}
      ></iframe>
    </div>
  );
});
