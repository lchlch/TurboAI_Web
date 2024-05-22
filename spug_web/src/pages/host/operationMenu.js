import React from "react";
import { observer } from "mobx-react";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Space, Modal, message } from "antd";
import { http } from "libs";
import store from "./store";
import { AuthButton } from "components";

export default observer(function (props) {
  function changeStoreShow(key, value, operation) {
    if (key) {
      store[key] = value;
    }
    //when reboot and shutdown, key is null
    if (!key) {
      handleConfirm(operation);
    }
    store.curOperationHostInfo = props.info;
  }

  const isDisabled = props.info.hostStatus === 2;

  // shutdown or reboot
  function handleConfirm(operation) {
    const apis = {
      shutdown: "api/v1/server/bash/shutdown",
      reboot: "api/v1/server/bash/reboot",
    };
    Modal.confirm({
      title: "operation confirm",
      content: `ready to ${operation}?`,
      onOk: () => {
        return http
          .get(apis[operation], { params: { ids: props.info.hostId } })
          .then(() => {
            message.success(`${operation} success`);
            store.fetchRecords();
          });
      },
    });
  }

  // const menu = (
  //   <Menu>
  //     <Menu.Item>
  //       <span onClick={() => changeStoreShow("show", 3)}>查看详情</span>
  //     </Menu.Item>

  //     <Menu.Item>
  //       <span onClick={() => changeStoreShow(null, null, "reboot")}>重启</span>
  //     </Menu.Item>
  //     <Menu.Item>
  //       <span onClick={() => changeStoreShow("buildOsForm", 1)}>安装系统</span>
  //     </Menu.Item>
  //     <Menu.Item>
  //       <span onClick={() => changeStoreShow("buildOsForm", 2)}>重装</span>
  //     </Menu.Item>
  //     <Menu.Item>
  //       <span onClick={() => changeStoreShow("show", 1)}>webssh</span>
  //     </Menu.Item>
  //     <Menu.Item>
  //       <span onClick={() => changeStoreShow(null, null, "shutdown")}>
  //         关机
  //       </span>
  //     </Menu.Item>
  //     <Menu.Item>
  //       <span onClick={() => changeStoreShow("logVisible", true)}>
  //         查看日志
  //       </span>
  //     </Menu.Item>
  //     <Menu.Item>
  //       <span onClick={() => changeStoreShow("show", 2)}>文件传输</span>
  //     </Menu.Item>
  //   </Menu>
  // );

  const menu = (
    <Menu
      items={[
        {
          key: "key-1",
          label: (
            <AuthButton
              type="link"
              disabled={isDisabled}
              onClick={() => changeStoreShow("show", 3)}
              auth="query"
            >
              host detail
            </AuthButton>
          ),
        },
        {
          key: "key-2",
          label: (
            <AuthButton
              type="link"
              disabled={isDisabled}
              onClick={() => changeStoreShow(null, null, "reboot")}
              auth="cmd"
            >
              reboot
            </AuthButton>
          ),
          // icon: <SmileOutlined />,
        },
        {
          key: "key-3",
          label: (
            <AuthButton
              type="link"
              disabled={isDisabled}
              onClick={() => changeStoreShow("buildOsForm", 1)}
              auth="cmd"
            >
              install OS
            </AuthButton>
          ),
        },
        {
          key: "key-4",
          label: (
            <AuthButton
              type="link"
              disabled={isDisabled}
              onClick={() => changeStoreShow("buildOsForm", 2)}
              auth="cmd"
            >
              reinstall OS
            </AuthButton>
          ),
        },
        {
          key: "key-5",
          label: (
            <AuthButton
              type="link"
              disabled={isDisabled}
              onClick={() => changeStoreShow("show", 1)}
              auth="ssh"
            >
              webssh
            </AuthButton>
          ),
        },
        {
          key: "key-6",
          label: (
            <AuthButton
              type="link"
              disabled={isDisabled}
              onClick={() => changeStoreShow(null, null, "shutdown")}
              auth="cmd"
            >
              shutdown
            </AuthButton>
          ),
        },
        {
          key: "key-7",
          label: (
            <AuthButton
              type="link"
              disabled={isDisabled}
              onClick={() => changeStoreShow("logVisible", true)}
              auth="log"
            >
              logs
            </AuthButton>
          ),
        },
        {
          key: "key-8",
          label: (
            <AuthButton
              type="link"
              disabled={isDisabled}
              onClick={() => changeStoreShow("show", 2)}
              auth="file"
            >
              file transfer
            </AuthButton>
          ),
        },
      ]}
    />
  );

  return (
    <Dropdown overlay={menu}>
      <AuthButton onClick={(e) => e.preventDefault()} type="link" style={{padding: 0}}>
        <Space>
          Host Operations
          <DownOutlined />
        </Space>
      </AuthButton>
    </Dropdown>
  );
});
