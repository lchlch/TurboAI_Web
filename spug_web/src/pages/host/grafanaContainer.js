import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { CloseOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import styles from "./index.module.less";
import store from "./store";
import { http } from "libs";

export default observer(function () {
  const [isMouseInside, setIsMouseInside] = useState(false);
  // const [hostId, setHostId] = useState("");
  const [hostUrl, setHostUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // console.log(store.curOperationHostInfo)
    let hostId = store?.curOperationHostInfo?.hostId;
    setLoading(true);
    http
      .get(`/api/v1/grafana/url/${hostId}`)
      .then((res) => {
        setHostUrl(res);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
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

  const onIframeLoad = () => {
    console.log("0000000000000000000");
  };
  return (
    <div
      className={styles.iframeContainer}
      style={{ position: "relative" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Spin
        spinning={loading}
        style={{ position: "absolute", left: "49%", top: "40%" }}
      />
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
        className={styles.iframeGrafana}
        src={hostUrl}
        title="file"
        frameBorder={0}
        onLoad={onIframeLoad}
      ></iframe>
    </div>
  );
});
