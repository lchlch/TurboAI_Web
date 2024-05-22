import React from "react";
import { observer } from "mobx-react";
import { Table, Tag } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Action, TableCard } from "components";
// import IPAddress from "./IPAddress";
// import { hasPermission } from "libs";
import store from "./store";
// import icons from "./icons";
// import moment from "moment";
import OperationMenu from "./operationMenu";

function ComTable() {
  function getHostStatus(hostStatus) {
    let dict = {
      0: {
        desc: "agent monitoring",
        type: "success",
      },
      1: {
        desc: "running",
        type: "processing",
      },
      2: {
        desc: "installing",
        type: "warning",
        icon: <LoadingOutlined />,
      },
      3: {
        desc: "outline",
        type: "error",
      },
      4: {
        desc: "reboting",
        type: "warning",
        icon: <LoadingOutlined />,
      },
    };
    return dict[hostStatus] || {};
  }

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

  return (
    <TableCard
      tKey="hi"
      rowKey="hostId"
      // title={
      //   // <Input
      //   //   allowClear
      //   //   value={store.f_word}
      //   //   placeholder="输入名称/IP检索"
      //   //   style={{ maxWidth: 250 }}
      //   //   onChange={(e) => (store.f_word = e.target.value)}
      //   // />
      // }
      loading={store.isFetching}
      dataSource={store.dataSource}
      onReload={store.fetchRecords}
      actions={
        [
          // <AuthFragment auth="host.host.add">
          //   <Dropdown
          //     overlay={
          //       <Menu onClick={handleImport}>
          //         <Menu.Item key="form">
          //           <Space>
          //             <FormOutlined
          //               style={{ fontSize: 16, marginRight: 4, color: "#1890ff" }}
          //             />
          //             <span>新建主机</span>
          //           </Space>
          //         </Menu.Item>
          //         <Menu.Item key="excel">
          //           <Space>
          //             <Avatar shape="square" size={20} src={icons.excel} />
          //             <span>Excel</span>
          //           </Space>
          //         </Menu.Item>
          //       </Menu>
          //     }
          //   >
          //     <Button type="primary" icon={<PlusOutlined />}>
          //       新建 <DownOutlined />
          //     </Button>
          //   </Dropdown>
          // </AuthFragment>,
          // <AuthButton
          //   auth="host.host.add"
          //   type="primary"
          //   icon={<SyncOutlined/>}
          //   onClick={() => store.showSync()}>验证</AuthButton>,
          // <Radio.Group value={store.f_status} onChange={e => store.f_status = e.target.value}>
          //   <Radio.Button value="">全部</Radio.Button>
          //   <Radio.Button value={false}>未验证</Radio.Button>
          // </Radio.Group>
        ]
      }
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
        hide
        render={(info) => <div>{info.hostId}</div>}
      />
      <Table.Column
        showSorterTooltip={false}
        title="Host Name"
        render={(info) => (
          <Action.Button onClick={() => store.showDetail(info)}>
            {info.hostName}
          </Action.Button>
        )}
        sorter={(a, b) => a.hostName.localeCompare(b.hostName)}
      />

      <Table.Column title="mac" render={(info) => <div>{info.mac}</div>} />
      <Table.Column title="IP" render={(info) => <div>{info.ip}</div>} />
      <Table.Column
        title="Host Status"
        render={(info) => (
          <div>
            <Tag color={getHostStatus(info.hostStatus).type}>
              {getHostStatus(info.hostStatus).icon}
              {getHostStatus(info.hostStatus).desc}
            </Tag>
          </div>
        )}
      />
      <Table.Column title="Notes" render={(info) => <div>{info.remark}</div>} />
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
        title="Operations"
        render={(info) => (
          <div>
            <Action>
              {/* <Action.Button
                  auth="host.host.edit"
                  onClick={() => store.showForm(info)}
                >
                  编辑
                </Action.Button>
                <Action.Button
                  danger
                  auth="host.host.del"
                  onClick={() => handleDelete(info)}
                >
                  删除
                </Action.Button> */}
              <OperationMenu info={info}></OperationMenu>
            </Action>
          </div>
        )}
      />
    </TableCard>
  );
}

export default observer(ComTable);
