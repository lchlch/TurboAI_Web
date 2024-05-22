import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { CloseOutlined } from "@ant-design/icons";
// import { Dropdown, Menu, Space } from "antd";
import styles from "./index.module.less";
import store from "./store";

export default observer(function () {
  const [isMouseInside, setIsMouseInside] = useState(false);

  const [destIp, setDestIp] = useState("");

  useEffect(() => {
    setDestIp(store.curOperationHostInfo.ip);
  }, []);

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
            fontSize: "30px", // 设置图标大小
            color: "#2563fc", // 设置图标颜色
          }}
        />
      )}
      <iframe
        className={styles.iframe}
        src={`http://${destIp}:8000/`}
        title="file"
        frameBorder={0}
      ></iframe>
      {/* <iframe
        className={styles.iframe}
        src={`http://111.229.95.48:9991/`}
        title="file"
        frameBorder={0}
      ></iframe> */}
    </div>
  );
});
