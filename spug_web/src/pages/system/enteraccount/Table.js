import React from "react";
import { observer } from "mobx-react";
import { PlusOutlined } from "@ant-design/icons";
import { Radio, Modal, Badge, message } from "antd";
import { TableCard, Action } from "components";
import http from "libs/http";
import store from "./store";
import rStore from "../role/store";
import { AuthButton, AuthDiv } from "components";
import HostSelector from "pages/host/SelectorNew";

@observer
class ComTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // rawRecords: [],
    };
  }

  // initialResources = () => {
  //   return http
  //     .get("/api/v1/server/userHost/list", {
  //       params: { userId: localStorage.getItem("userId") },
  //     })
  //     .then((resources) => {
  //       let rawRecordsTmp = resources.map((item) => {
  //         item.hostId = item.hostId.toString();
  //         return item;
  //       });
  //       this.setState({ rawRecords: rawRecordsTmp });
  //     })
  //     .finally(() => {});
  // };

  componentDidMount() {
    if (rStore.records && rStore.records.length === 0) {
      rStore.fetchRecords().then(() => store.fetchRecords());
    } else {
      store.fetchRecords();
    }

    // this.initialResources();
  }

  columns = [
    {
      title: "企业名称",
      dataIndex: "companyName",
    },
    {
      title: "联系人",
      dataIndex: "contactUserName",
    },
    {
      title: "联系电话",
      dataIndex: "contactPhone",
    },
    {
      title: "联系地址",
      dataIndex: "address",
      // render: v => v.map(x => rStore.idMap[x]?.name).join(',')
    },
    // {
    //   title: "管理员账户",
    //   dataIndex: "username",
    //   // render: v => v.map(x => rStore.idMap[x]?.name).join(',')
    // },
    {
      title: "域名",
      dataIndex: "domain",
      // render: v => v.map(x => rStore.idMap[x]?.name).join(',')
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
      title: "创建时间",
      dataIndex: "createTime",
    },
    {
      title: "更新时间",
      dataIndex: "updateTime",
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

          <AuthDiv style={{ display: "inline-block" }}>
            <HostSelector
              title={"分配资源"}
              value={store.host_ids}
              onChange={(ids) => {
                store.host_ids = ids;
              }}
              privateSubmit={() => this.handleResource(info)}
              role="tenant"
            />
          </AuthDiv>
          <AuthDiv style={{ display: "inline-block" }}>
            <HostSelector
              title={"回收资源"}
              value={store.host_ids}
              onChange={(ids) => {
                store.host_ids = ids;
              }}
              privateSubmit={() => this.handleResource(info, "release")}
              role="tenant"
              release={{ release: true, tenantId: info.tenantId }}
            />
          </AuthDiv>
          <Action.Button
            danger
            onClick={() => this.handleDelete(info)}
            auth="remove"
          >
            删除
          </Action.Button>
        </Action>
      ),
    },
  ];

  // 处理 资源分配 函数
  handleResource = (text, release) => {
    let content = `确认给用户【${text["companyName"]}】分配资源?`;
    let httpMethod = release ? http.delete : http.put;
    let httpUrl = release
      ? `/api/v1/server/userHost`
      : `/api/v1/server/userHost`;
    let data = release
      ? {
          data: {
            tenantId: text.tenantId,
            hostIds: store.host_ids,
          },
        }
      : {
          tenantId: text.tenantId,
          hostIds: store.host_ids,
        };
    if (release) {
      content = `确认释放用户【${text["companyName"]}】分配的资源?`;
    }
    return new Promise((resolve, reject) => {
      Modal.confirm({
        title: "操作确认",
        content: content,
        onOk: () => {
          return httpMethod(httpUrl, data)
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
        text["companyName"]
      }】?`,
      onOk: () => {
        return http
          .put(`/api/v1/system/tenant/changeStatus`, {
            id: text.id,
            tenantId: text.tenantId,
            status: text["status"] === "0" ? "1" : "0",
          })
          .then(() => {
            message.success("操作成功");
            store.fetchRecords();
          });
      },
    });
  };

  // handleReset = (info) => {
  //   Modal.confirm({
  //     icon: <ExclamationCircleOutlined />,
  //     title: "重置登录密码",
  //     content: (
  //       <Form layout="vertical" style={{ marginTop: 24 }}>
  //         <Form.Item
  //           required
  //           label="重置后的新密码"
  //           extra="至少8位包含数字、小写和大写字母。"
  //         >
  //           <Input.Password
  //             onChange={(val) => this.setState({ password: val.target.value })}
  //           />
  //         </Form.Item>
  //       </Form>
  //     ),
  //     onOk: () => {
  //       return http
  //         .patch("/api/account/user/", {
  //           id: info.id,
  //           password: this.state.password,
  //         })
  //         .then(() => message.success("重置成功", 0.5));
  //     },
  //   });
  // };

  handleDelete = (text) => {
    Modal.confirm({
      title: "删除确认",
      content: `确定要删除【${text["companyName"]}】?`,
      onOk: () => {
        return http.delete(`/api/v1/system/tenant/${text.id}`).then(() => {
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
        rowKey="id"
        title="账户列表"
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
