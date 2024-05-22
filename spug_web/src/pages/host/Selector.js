import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Modal, Row, Col, Table, Button, Space, Alert } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import hStore from "./store";
import store from "./store2";
import styles from "./selector.module.less";

function HostSelector(props) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    store.onlySelf = props.onlySelf;
    hStore.initial().then(() => {
      store.rawRecords = hStore.rawRecords;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSelectedRowKeys([...props.value]);
  }, [props.value]);

  function handleClickRow(record) {
    let tmp = new Set(selectedRowKeys);
    if (!tmp.delete(record.hostId)) {
      if (props.onlyOne) tmp.clear();
      tmp.add(record.hostId);
    }
    setSelectedRowKeys([...tmp]);
  }

  function handleSubmit() {
    if (props.mode === "ids") {
      props.onChange(props.onlyOne ? selectedRowKeys[0] : selectedRowKeys);
    } else if (props.mode === "rows") {
      const value = store.rawRecords.filter((x) =>
        selectedRowKeys.includes(x.hostId)
      );
      props.onChange(props.onlyOne ? value[0] : value);
    }
    if (props.privateSubmit) {
      props.privateSubmit().then(() => {
        handleClose();
      });
    }
    handleClose();
  }

  function handleSelectAll(selected) {
    let tmp = new Set(selectedRowKeys);
    for (let item of store.dataSource) {
      if (selected) {
        tmp.add(item.hostId);
      } else {
        tmp.delete(item.hostId);
      }
    }
    setSelectedRowKeys([...tmp]);
  }

  // function treeRender(nodeData) {
  //   const length = store.counter[nodeData.key]?.size
  //   return (
  //     <div className={styles.treeNode}>
  //       {expands.includes(nodeData.key) ? <FolderOpenOutlined/> : <FolderOutlined/>}
  //       <div className={styles.title}>{nodeData.title}</div>
  //       {length ? <div className={styles.number}>{length}</div> : null}
  //     </div>
  //   )
  // }

  function handleClose() {
    setSelectedRowKeys([]);
    setLoading(false);
    setVisible(false);
    if (props.onCancel) {
      props.onCancel();
    }
  }

  return (
    <div className={styles.selector}>
      {props.mode !== "group" &&
        (props.children ? (
          <div onClick={() => setVisible(true)}>{props.children}</div>
        ) : props.type === "button" ? (
          props.value.length > 0 ? (
            <Alert
              type="info"
              className={styles.area}
              message={
                <div>
                  {" "}
                  <b style={{ fontSize: 18, color: "#1890ff" }}>
                    {props.value.length}
                  </b>{" "}
                  selected
                </div>
              }
              onClick={() => setVisible(true)}
            />
          ) : (
            <Button icon={<PlusOutlined />} onClick={() => setVisible(true)}>
              Add target hosts
            </Button>
          )
        ) : (
          <div style={{ display: "flex", alignItems: "center" }}>
            {props.value.length > 0 && (
              <span style={{ marginRight: 16 }}>
                selected {props.value.length}
              </span>
            )}
            <Button
              type="link"
              style={{ padding: 0 }}
              onClick={() => setVisible(true)}
            >
              {props.title || "select host"}
            </Button>
          </div>
        ))}

      <Modal
        visible={props.mode === "group" || visible}
        width={1000}
        className={styles.modal}
        title={props.title || "hosts list"}
        onOk={handleSubmit}
        okButtonProps={{
          disabled: selectedRowKeys.length === 0 && !props.nullable,
        }}
        confirmLoading={loading}
        onCancel={handleClose}
      >
        <Row>
          <Col span={24} style={{ paddingLeft: 12 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <Space hidden={selectedRowKeys.length === 0}>
                <div>{selectedRowKeys.length} selected</div>
                <Button
                  type="link"
                  style={{ paddingRight: 0 }}
                  onClick={() => setSelectedRowKeys([])}
                >
                  cancel
                </Button>
              </Space>
            </div>
            <Table
              rowKey="hostId"
              dataSource={store.dataSource}
              pagination={false}
              scroll={{ y: 480 }}
              onRow={(record) => {
                return {
                  onClick: () => handleClickRow(record),
                };
              }}
              rowSelection={{
                selectedRowKeys,
                hideSelectAll: props.onlyOne,
                onSelect: handleClickRow,
                onSelectAll: handleSelectAll,
              }}
            >
              <Table.Column
                ellipsis
                width={170}
                title="host name"
                dataIndex="hostName"
              />
              <Table.Column
                width={320}
                title="mac"
                render={(info) => <span>{info.mac}</span>}
              />
              <Table.Column
                width={320}
                title="ip"
                render={(info) => <span>{info.ip}</span>}
              />
              <Table.Column title="notes" dataIndex="desc" />
            </Table>
          </Col>
        </Row>
      </Modal>
    </div>
  );
}

HostSelector.defaultProps = {
  value: [],
  type: "text",
  mode: "ids",
  onlyOne: false,
  nullable: false,
  onChange: () => null,
};

export default observer(HostSelector);
