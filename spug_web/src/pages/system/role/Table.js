import React from "react";
import { observer } from "mobx-react";
import { Modal, Badge, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { TableCard, AuthButton, Action } from "components";
import http from "libs/http";
import store from "./store";
import uStore from "../account/store";

@observer
class ComTable extends React.Component {
  componentDidMount() {
    store.fetchRecords();
    if (uStore.records && uStore.records.length === 0) {
      uStore.fetchRecords();
    }
  }

  columns = [
    {
      title: "id",
      dataIndex: "roleId",
    },
    {
      title: "角色名称",
      dataIndex: "roleName",
    },
    // {
    //   title: "关联账户",
    //   render: (info) =>
    //     info.used ? (
    //       <Popover
    //         overlayClassName={styles.roleUser}
    //         content={<RoleUsers id={info.id} />}
    //       >
    //         <Button type="link">{info.used}</Button>
    //       </Popover>
    //     ) : (
    //       <Button type="link" disabled>
    //         {info.used}
    //       </Button>
    //     ),
    // },
    {
      title: "描述信息",
      dataIndex: "remark",
      ellipsis: true,
    },
    {
      title: "状态",
      render: (text) =>
        text["status"] === "0" ? (
          <Badge status="success" text="正常" />
        ) : (
          <Badge status="default" text="禁用" />
        ),
    },
    {
      title: "操作",
      width: 400,
      render: (info) => (
        <Action>
          <Action.Button onClick={() => store.showForm(info)} auth="edit">
            编辑
          </Action.Button>
          <Action.Button onClick={() => store.showPagePerm(info)} auth="edit">
            功能权限
          </Action.Button>
          {/* <Action.Button onClick={() => store.showDeployPerm(info)}>
            禁用
          </Action.Button> */}
          <Action.Button onClick={() => this.handleActive(info)} auth="edit">
            {info["status"] === "0" ? "禁用" : "启用"}
          </Action.Button>
          {/* <Action.Button onClick={() => store.showHostPerm(info)} auth="edit">
            主机权限
          </Action.Button> */}
          <Action.Button danger onClick={() => this.handleDelete(info)} auth="remove">
            删除
          </Action.Button>
        </Action>
      ),
    },
  ];

  handleDelete = (text) => {
    Modal.confirm({
      title: "删除确认",
      content: `确定要删除角色【${text["roleName"]}】?`,
      onOk: () => {
        return http.delete(`/api/v1/system/role/${text.roleId}`).then(() => {
          message.success("删除成功");
          store.fetchRecords();
        });
      },
    });
  };

  handleActive = (text) => {
    Modal.confirm({
      title: "操作确认",
      content: `确定要${text["status"] === "0" ? "禁用" : "启用"}【${
        text["roleName"]
      }】?`,
      onOk: () => {
        return http
          .put(`/api/v1/system/role/changeStatus`, {
            roleId: text.roleId,
            status: text["status"] === "0" ? "1" : "0",
          })
          .then(() => {
            message.success("操作成功");
            store.fetchRecords();
          });
      },
    });
  };

  render() {
    return (
      <TableCard
        rowKey="id"
        title="角色列表"
        loading={store.isFetching}
        dataSource={store.dataSource}
        onReload={store.fetchRecords}
        actions={[
          <AuthButton
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => store.showForm()}
            auth="add"
          >
            新建
          </AuthButton>,
        ]}
        pagination={{
          showSizeChanger: true,
          showLessItems: true,
          showTotal: (total) => `共 ${total} 条`,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        columns={this.columns}
      />
    );
  }
}

export default ComTable;
