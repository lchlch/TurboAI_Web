import React from "react";
import { observer } from "mobx-react";
import { Table, Modal, message, Popover } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Action, AuthButton, TableCard } from "components";
import { http } from "libs";
import store from "./store";

@observer
class ComTable extends React.Component {
  componentDidMount() {
    store.fetchRecords();
  }

  handleActive = (text) => {
    Modal.confirm({
      title: "操作确认",
      content: `确定要${text["is_active"] ? "禁用" : "启用"}【${
        text["name"]
      }】?`,
      onOk: () => {
        return http
          .patch(`/api/monitor/`, {
            id: text.id,
            is_active: !text["is_active"],
          })
          .then(() => {
            message.success("操作成功");
            store.fetchRecords();
          });
      },
    });
  };

  handleDelete = (text) => {
    Modal.confirm({
      title: "删除确认",
      content: `确定要删除【${text["name"]}】?`,
      onOk: () => {
        return http
          .delete("/api/v1/prometheus/alerts", {
            data: {
              alert: text.name,
              expr: text.query,
              description: text.desc,
            },
          })
          .then(() => {
            message.success("删除成功");
            setTimeout(() => {
              store.fetchRecords();
            }, 1000);
          });
      },
    });
  };

  renderWaringInfo = (info) => {
    return info.alerts.map((item) => {
      return <p>{item?.annotations?.description}</p>;
    });
  };

  render() {
    return (
      <TableCard
        tKey="mi"
        rowKey="id"
        title="monitor tasks"
        loading={store.isFetching}
        dataSource={store.dataSource}
        onReload={store.fetchRecords}
        actions={[
          <AuthButton
            auth="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => store.showForm()}
          >
            new
          </AuthButton>,
          // <Radio.Group value={store.f_active} onChange={e => store.f_active = e.target.value}>
          //   <Radio.Button value="">全部</Radio.Button>
          //   <Radio.Button value="1">已激活</Radio.Button>
          //   <Radio.Button value="0">未激活</Radio.Button>
          // </Radio.Group>
        ]}
        pagination={{
          showSizeChanger: true,
          showLessItems: true,
          showTotal: (total) => `共 ${total} 条`,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
      >
        <Table.Column title="task name" dataIndex="name" />
        <Table.Column
          title="condition"
          render={(info) => {
            return (
              <div
                style={{
                  width: "250px",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  TextOverflow: "ellipsis",
                }}
                title={info.query}
              >
                <Popover content={info.query}>{info.query}</Popover>
              </div>
            );
          }}
        />
        <Table.Column title="duration" dataIndex="duration" />
        {/* <Table.Column title="报警次数" dataIndex="alertsNum" /> */}
        <Table.Column
          title="Is alarming"
          width={120}
          render={(info) => {
            return info.alertsNum > 0 ? (
              <div
                style={{
                  width: "150px",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  TextOverflow: "ellipsis",
                  color: "red",
                }}
              >
                <Popover content={this.renderWaringInfo(info)}>
                  warning({info.alertsNum})
                  <span style={{ color: "#ccc", fontSize: "11px" }}>
                    (hover to show)
                  </span>
                </Popover>
              </div>
            ) : (
              <div style={{ color: "green" }}>normal</div>
            );
          }}
        />
        {/* <Table.Column title="报警内容" dataIndex="desc" /> */}
        <Table.Column
          title="warning info"
          render={(info) => {
            return (
              <div
                style={{
                  width: "250px",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  TextOverflow: "ellipsis",
                }}
                title={info.desc}
              >
                <Popover content={info.desc}>{info.desc}</Popover>
              </div>
            );
          }}
        />
        {/* <Table.Column title="状态" render={info => {
          if (info.is_active) {
            return <Tag color="blue">已激活</Tag>
          } else {
            return <Tag color="red">未激活</Tag>
          }
        }}/> */}
        <Table.Column
          title="update by"
          dataIndex="latest_run_time_alias"
          sorter={(a, b) => a.latest_run_time.localeCompare(b.latest_run_time)}
        />
        <Table.Column hide title="description" dataIndex="desc" />
        <Table.Column
          width={180}
          title="operation"
          render={(info) => (
            <Action>
              {/* <Action.Button
                  auth="monitor.monitor.edit"
                  onClick={() => this.handleActive(info)}
                >
                  {info["is_active"] ? "禁用" : "启用"}
                </Action.Button> */}
              <Action.Button auth="edit" onClick={() => store.showForm(info)}>
                edit
              </Action.Button>
              <Action.Button
                danger
                auth="remove"
                onClick={() => this.handleDelete(info)}
              >
                delete
              </Action.Button>
            </Action>
          )}
        />
      </TableCard>
    );
  }
}

export default ComTable;
