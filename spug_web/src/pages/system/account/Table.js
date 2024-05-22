import React from "react";
import { observer } from "mobx-react";
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Radio, Modal, Button, Badge, message, Input } from "antd";
import { TableCard, Action, AuthDiv } from "components";
import http from "libs/http";
import store from "./store";
import rStore from "../role/store";
import { hasPermission } from "libs";
import HostSelector from "pages/host/SelectorNew";

@observer
class ComTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
    };
  }

  componentDidMount() {
    if (rStore.records && rStore.records.length === 0) {
      rStore.fetchRecords().then(() => store.fetchRecords());
    } else {
      store.fetchRecords();
    }
  }

  columns = [
    {
      title: "账号",
      dataIndex: "userName",
    },
    {
      title: "昵称",
      dataIndex: "nickname",
    },
    {},
    {
      title: "手机号",
      dataIndex: "phonenumber",
    },
    {},
    {
      title: "邮箱",
      dataIndex: "email",
    },
    {
      title: "角色",
      dataIndex: "roleIds",
      render: (v) => v && [v].map((x) => rStore.idMap[x]?.roleName).join(","),
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
      render: (info) => (
        <Action>
          <Action.Button onClick={() => this.handleActive(info)} auth="edit">
            {info["status"] === "0" ? "禁用" : "启用"}
          </Action.Button>
          <Action.Button onClick={() => store.showForm(info)} auth="edit">
            编辑
          </Action.Button>
          <Action.Button
            // disabled={info["type"] === "ldap"}
            onClick={() => this.handleReset(info)}
            auth="resetPwd"
          >
            重置密码
          </Action.Button>
          {localStorage.getItem("username") !== "superadmin" && (
            <AuthDiv style={{ display: "inline-block" }}>
              <HostSelector
                title={"资源权限"}
                style={{ display: "inline-block" }}
                value={store.host_ids}
                onChange={(ids) => {
                  store.host_ids = ids;
                }}
                privateSubmit={() => this.handleResource(info)}
                role="user"
              />
            </AuthDiv>
          )}
          {localStorage.getItem("username") !== "superadmin" && (
            <AuthDiv style={{ display: "inline-block" }}>
              <HostSelector
                title={"回收资源"}
                value={store.host_ids}
                onChange={(ids) => {
                  store.host_ids = ids;
                }}
                privateSubmit={() => this.handleResource(info, "release")}
                role="user"
                release={{ release: true, userId: info.userId }}
              />
            </AuthDiv>
          )}
          <Action.Button
            danger
            onClick={() => this.handleDelete(info)}
            auth="resetPwd"
          >
            删除
          </Action.Button>
        </Action>
      ),
    },
  ];

  // 处理 资源分配 函数
  handleResource = (text, release) => {
    let content = `确认给用户【${text["userName"]}】分配资源?`;
    let httpMethod = release ? http.delete : http.put;
    let data = release
      ? {
          data: {
            userId: text.userId,
            hostIds: store.host_ids,
          },
        }
      : {
          userId: text.userId,
          hostIds: store.host_ids,
        };
    return new Promise((resolve, reject) => {
      Modal.confirm({
        title: "操作确认",
        content: content,
        onOk: () => {
          return httpMethod(`/api/v1/server/userHost`, data)
            .then(() => {
              message.success("操作成功");
              resolve("success");
            })
            .catch((e) => {
              reject(e);
            });
        },
      });
    });
  };

  handleActive = (text) => {
    Modal.confirm({
      title: "操作确认",
      content: `确定要${text["status"] === "0" ? "禁用" : "启用"}【${
        text["userName"]
      }】?`,
      onOk: () => {
        return http
          .put(`/api/v1/system/user/changeStatus`, {
            userId: text.userId,
            status: text["status"] === "0" ? "1" : "0",
          })
          .then(() => {
            message.success("操作成功");
            store.fetchRecords();
          });
      },
    });
  };

  handleReset = (info) => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      title: "重置登录密码",
      content: (
        <Form layout="vertical" style={{ marginTop: 24 }}>
          <Form.Item
            required
            label="重置后的新密码"
            extra="至少8位包含数字、小写和大写字母。"
          >
            <Input.Password
              onChange={(val) => this.setState({ password: val.target.value })}
            />
          </Form.Item>
        </Form>
      ),
      onOk: () => {
        return http
          .put("/api/v1/system/user/resetPwd", {
            userId: info.userId,
            password: this.state.password,
          })
          .then(() => message.success("重置成功", 0.5));
      },
    });
  };

  handleDelete = (text) => {
    Modal.confirm({
      title: "删除确认",
      content: `确定要删除【${text["userName"]}】?`,
      onOk: () => {
        return http
          .delete(`/api/v1/system/user/${text.userId}`, {
            params: { userId: text.userId },
          })
          .then(() => {
            message.success("删除成功");
            store.fetchRecords();
          });
      },
    });
  };

  render() {
    return (
      <TableCard
        tKey="sa"
        rowKey="userId"
        title="账户列表"
        loading={store.isFetching}
        dataSource={store.dataSource}
        onReload={store.fetchRecords}
        actions={[
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => store.showForm()}
            disabled={!hasPermission("add")}
          >
            新建
          </Button>,
          <Radio.Group
            value={store.f_status}
            onChange={(e) => (store.f_status = e.target.value)}
          >
            <Radio.Button value="">全部</Radio.Button>
            <Radio.Button value="0">正常</Radio.Button>
            <Radio.Button value="1">禁用</Radio.Button>
          </Radio.Group>,
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
