import React, { useState } from "react";
import { observer } from "mobx-react";
import { Table, Modal, Button, message, Switch } from "antd";
import { Action, TableCard, AuthFragment } from "components";
// import IPAddress from "./IPAddress";
import { http, hasPermission } from "libs";
import store from "./store";
// import icons from "./icons";
// import moment from "moment";

function ComTable() {
  // function handleImport(menu) {
  //   if (menu.key === "excel") {
  //     store.importVisible = true;
  //   } else if (menu.key === "form") {
  //     store.showForm();
  //   } else {
  //     store.cloudImport = menu.key;
  //   }
  // }

  // function ExpTime(props) {
  //   if (!props.value) return null;
  //   let value = moment(props.value);
  //   const days = value.diff(moment(), "days");
  //   if (days > 30) {
  //     return (
  //       <span>
  //         剩余 <b style={{ color: "#389e0d" }}>{days}</b> 天
  //       </span>
  //     );
  //   } else if (days > 7) {
  //     return (
  //       <span>
  //         剩余 <b style={{ color: "#faad14" }}>{days}</b> 天
  //       </span>
  //     );
  //   } else if (days >= 0) {
  //     return (
  //       <span>
  //         剩余 <b style={{ color: "#d9363e" }}>{days}</b> 天
  //       </span>
  //     );
  //   } else {
  //     return (
  //       <span>
  //         过期 <b style={{ color: "#d9363e" }}>{Math.abs(days)}</b> 天
  //       </span>
  //     );
  //   }
  // }

  const [rowSelectionProps, setRowSelectionProps] = useState("");
  const [showbuy, setShowbuy] = useState(false);
  const [selectedHosts, setSelectedHosts] = useState([]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedHosts(selectedRows);
      // console.log(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   "selectedRows: ",
      //   selectedRows
      // );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const onSwitchChange = (checked) => {
    if (checked) {
      setShowbuy(true);
      setRowSelectionProps({ rowSelection: rowSelection });
    } else {
      setShowbuy(false);
      setRowSelectionProps({});
    }
  };

  const onBuyClick = () => {
    if (selectedHosts.length === 0) {
      message.error("please select at least one host");
      return;
    }
    const hostsNames = selectedHosts.map((item) => item.hostName).join(",");
    const hostsIds = selectedHosts.map((item) => item.hostId).join(",");

    Modal.confirm({
      title: "confirm",
      content: `decide to buy the following hosts【 ${hostsNames} 】`,
      onOk: () => {
        return http.post(`/api/v1/hostConf/buy/${hostsIds}`).then(() => {
          message.success("buy success");
          store.fetchRecords();
        });
      },
    });
  };

  const onSingleBuyClick = (text) => {
    Modal.confirm({
      title: "confirm",
      content: `decide to buy the host: 【 ${text["hostName"]} 】`,
      onOk: () => {
        return http.post(`/api/v1/hostConf/buy/${text.hostId}`).then(() => {
          message.success("buy success");
          store.fetchRecords();
        });
      },
    });
  };

  return (
    <TableCard
      tKey="hi"
      rowKey="hostId"
      loading={store.isFetching}
      dataSource={store.dataSource}
      onReload={store.fetchRecords}
      {...rowSelectionProps}
      actions={[
        <AuthFragment auth="list">
          <div
            style={{
              display: "flex",
              justifyConten: "center",
              alignItems: "center",
            }}
          >
            {showbuy ? (
              <Button type="primary" size="small" onClick={onBuyClick}>
                Buy Now
              </Button>
            ) : (
              ""
            )}
            <Switch
              style={{ marginLeft: "20px" }}
              onChange={onSwitchChange}
              checkedChildren="single"
              unCheckedChildren="batch"
            />
          </div>

          {/* <Dropdown
              overlay={
                <Menu onClick={handleImport}>
                  <Menu.Item key="form">
                    <Space>
                      <FormOutlined
                        style={{ fontSize: 16, marginRight: 4, color: "#1890ff" }}
                      />
                      <span>新建主机</span>
                    </Space>
                  </Menu.Item>
                  <Menu.Item key="excel">
                    <Space>
                      <Avatar shape="square" size={20} src={icons.excel} />
                      <span>Excel</span>
                    </Space>
                  </Menu.Item>
                </Menu>
              }
            >
              <Button type="primary" icon={<PlusOutlined />}>
                新建 <DownOutlined />
              </Button>
            </Dropdown> */}
        </AuthFragment>,
        // <AuthButton
        //   auth="host.host.add"
        //   type="primary"
        //   icon={<SyncOutlined/>}
        //   onClick={() => store.showSync()}>验证</AuthButton>,
        // <Radio.Group value={store.f_status} onChange={e => store.f_status = e.target.value}>
        //   <Radio.Button value="">全部</Radio.Button>
        //   <Radio.Button value={false}>未验证</Radio.Button>
        // </Radio.Group>
      ]}
      pagination={{
        showSizeChanger: true,
        showLessItems: true,
        hideOnSinglePage: true,
        showTotal: (total) => `共 ${total} 条`,
        pageSizeOptions: ["10", "20", "50", "100"],
      }}
    >
      <Table.Column
        title="hostId"
        render={(info) => <div>{info.hostId}</div>}
      />
      <Table.Column
        showSorterTooltip={false}
        title="host name"
        render={(info) => (
          <Action.Button onClick={() => store.showDetail(info)}>
            {info.hostName}
          </Action.Button>
        )}
        sorter={(a, b) => a.hostName.localeCompare(b.hostName)}
      />
      <Table.Column
        title="CPU Info"
        render={(info) => <div>{info.uuid ? info.uuid : "-"}</div>}
      />
      <Table.Column
        title="total memory"
        render={(info) => <div>{info.remark ? info.remark : "-"}</div>}
      />
      <Table.Column
        title="GPU Info"
        render={(info) => <div>{info.gpu ? info.gpu : "-"}</div>}
      />
      <Table.Column title="mac" render={(info) => <div>{info.mac}</div>} />
      {/* <Table.Column
        title="IP地址"
        render={(info) => (
          <div>
            <IPAddress ip={info.public_ip_address} isPublic />
            <IPAddress ip={info.private_ip_address} />
          </div>
        )}
      />
      <Table.Column
        title="配置信息"
        render={(info) => (
          <Space>
            <Tooltip title={info.os_name}>
              <Avatar shape="square" size={16} src={icons[info.os_type]} />
            </Tooltip>
            <span>
              {info.cpu}核 {info.memory}GB
            </span>
          </Space>
        )}
      /> */}
      {/* <Table.Column
        hide
        title="到期信息"
        dataIndex="expired_time"
        render={(v) => <ExpTime value={v} />}
      />
      <Table.Column hide title="备注信息" dataIndex="remark" />
      <Table.Column
        title="状态"
        dataIndex="is_verified"
        render={(v) =>
          v ? <Tag color="green">已验证</Tag> : <Tag color="orange">未验证</Tag>
        }
      /> */}
      <Table.Column
        width={160}
        title="operation"
        render={(info) => (
          <Action>
            <Action.Button
              auth="list"
              onClick={() => onSingleBuyClick(info)}
            >
              buy now
            </Action.Button>
            {/* <Action.Button
                danger
                auth="host.host.del"
                onClick={() => handleDelete(info)}
              >
                删除
              </Action.Button> */}
          </Action>
        )}
      />
    </TableCard>
  );
}

export default observer(ComTable);
