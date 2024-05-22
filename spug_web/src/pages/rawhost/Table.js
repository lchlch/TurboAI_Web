import React from "react";
import { observer } from "mobx-react";
import {
  Table,
  Modal,
  Dropdown,
  Button,
  Menu,
  // Avatar,
  // Tooltip,
  Space,
  // Tag,
  // Radio,
  // Input,
  message,
} from "antd";
import {
  PlusOutlined,
  DownOutlined,
  // SyncOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { Action, TableCard, AuthFragment } from "components";
// import IPAddress from "./IPAddress";
import { http } from "libs";
import store from "./store";
// import icons from "./icons";
// import moment from "moment";

function ComTable() {
  function handleDelete(text) {
    Modal.confirm({
      title: "delete confirm",
      content: `ready to delete【${text["hostName"]}】?`,
      onOk: () => {
        return http
          .delete(`/api/v1/server/host/${text.hostId}`)
          .then(() => {
            message.success("delete success");
            store.fetchRecords();
          });
      },
    });
  }

  function handleImport(menu) {
    if (menu.key === "excel") {
      store.importVisible = true;
    } else if (menu.key === "form") {
      store.showForm();
    } else {
      store.cloudImport = menu.key;
    }
  }

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
      //   <Input
      //     allowClear
      //     value={store.f_word}
      //     placeholder="输入名称/IP检索"
      //     style={{ maxWidth: 250 }}
      //     onChange={(e) => (store.f_word = e.target.value)}
      //   />
      // }
      loading={store.isFetching}
      dataSource={store.dataSource}
      onReload={store.fetchRecords}
      actions={[
        <AuthFragment auth="add">
          <Dropdown
            overlay={
              <Menu onClick={handleImport}>
                <Menu.Item key="form">
                  <Space>
                    <FormOutlined
                      style={{ fontSize: 16, marginRight: 4, color: "#1890ff" }}
                    />
                    <span>add hosts</span>
                  </Space>
                </Menu.Item>
                {/* <Menu.Item key="excel">
                  <Space>
                    <Avatar shape="square" size={20} src={icons.excel} />
                    <span>Excel</span>
                  </Space>
                </Menu.Item> */}
              </Menu>
            }
          >
            <Button type="primary" icon={<PlusOutlined />}>
              new <DownOutlined />
            </Button>
          </Dropdown>
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
      <Table.Column title="hostId" render={(info) => <div>{info.hostId}</div>} />
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
                auth="edit"
                onClick={() => store.showForm(info)}
              >
                edit
              </Action.Button>
              <Action.Button
                danger
                auth="remove"
                onClick={() => handleDelete(info)}
              >
                delete
              </Action.Button>
            </Action>
          )}
        />
    </TableCard>
  );
}

export default observer(ComTable);
