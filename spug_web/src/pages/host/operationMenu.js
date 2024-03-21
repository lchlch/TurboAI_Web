import React, { useState } from "react";
import { observer } from "mobx-react";
import { DownOutlined, SmileOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Space } from "antd";
import store from "./store";

export default observer(function () {
  function changeStoreShow(key, value) {
    store[key] = value;
  }

  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <span onClick={() => changeStoreShow("show", 3)}>查看详情</span>
          ),
        },
        {
          key: "2",
          label: (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.aliyun.com"
            >
              重启
            </a>
          ),
          // icon: <SmileOutlined />,
        },
        {
          key: "3",
          label: (
            <span onClick={() => changeStoreShow("buildOsForm", 1)}>安装系统</span>
          ),
        },
        {
          key: "4",
          danger: true,
          label: (
            <span onClick={() => changeStoreShow("buildOsForm", 2)}>重装</span>
          ),
        },
        {
          key: "5",
          danger: true,
          label: <span onClick={() => changeStoreShow("show", 1)}>webssh</span>,
        },
        {
          key: "6",
          label: (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.luohanacademy.com"
            >
              关机
            </a>
          ),
        },
        {
          key: "7",
          label: (
            <span onClick={() => changeStoreShow("logVisible", true)}>
              查看日志
            </span>
          ),
        },
        {
          key: "8",
          label: (
            <span onClick={() => changeStoreShow("show", 2)}>文件上传</span>
          ),
        },
      ]}
    />
  );

  return (
    <Dropdown overlay={menu}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          主机操作
          <DownOutlined />
        </Space>
      </a>
    </Dropdown>
  );
});
