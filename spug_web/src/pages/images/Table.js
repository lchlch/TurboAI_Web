import React from "react";
import { observer } from "mobx-react";
import { Table, Modal, Tag, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Action, AuthButton, TableCard } from "components";
import { http } from "libs";
import store from "./store";

@observer
class ComTable extends React.Component {
  componentDidMount() {
    http
      .get(
        "/api/v1/system/dictData/list",
        { params: { dictType: "server_image_type" } },
        { timeout: 120000 }
      )
      .then((res) => {
        let dicArray = res.map((item) => ({
          label: item.dictLabel,
          value: item.dictValue,
        }));
        let getValueLabel = {};
        dicArray.forEach((item) => {
          getValueLabel[item.value] = item.label;
        });
        store.imageReleaseDic = { dicArray, getValueLabel };
        store.fetchRecords();
      });
  }

  // handleActive = (text) => {
  //   Modal.confirm({
  //     title: "操作确认",
  //     content: `确定要${text["is_active"] ? "禁用" : "启用"}【${
  //       text["name"]
  //     }】?`,
  //     onOk: () => {
  //       return http
  //         .patch(`/api/monitor/`, {
  //           id: text.id,
  //           is_active: !text["is_active"],
  //         })
  //         .then(() => {
  //           message.success("操作成功");
  //           store.fetchRecords();
  //         });
  //     },
  //   });
  // };

  handleDelete = (text) => {
    Modal.confirm({
      title: "delete confirm",
      content: `ready to delete?`,
      onOk: () => {
        return http.delete(`/api/v1/server/imageList/${text.id}`).then(() => {
          message.success("delete success");
          store.fetchRecords();
        });
      },
    });
  };

  render() {
    return (
      <TableCard
        tKey="mi"
        rowKey="id"
        title="image management"
        loading={store.isFetching}
        dataSource={store.dataSource}
        onReload={store.fetchRecords}
        scroll={{ x: 1800 }}
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
        <Table.Column title="id" dataIndex="id" />
        <Table.Column title="image name" width={180} dataIndex="imageName" />
        <Table.Column
          title="image release label"
          width={180}
          dataIndex="imageReleaseLabel"
        />
        <Table.Column
          title="image version"
          dataIndex="imageVersion"
          width={200}
        />
        <Table.Column title="os core version" dataIndex="coreVersion" />
        <Table.Column title="s3Path" width={100} dataIndex="s3Path" />
        <Table.Column
          title="image type"
          render={(info) => {
            if (info.imageType === 0) {
              return <Tag color="blue">public image</Tag>;
            } else {
              return <Tag color="red">private image</Tag>;
            }
          }}
        />
        <Table.Column hide title="update by" dataIndex="updateBy" width={100} />
        <Table.Column
          hide
          title="update time"
          dataIndex="updateTime"
          sorter={(a, b) => a.latest_run_time.localeCompare(b.latest_run_time)}
        />
        <Table.Column title="creator" dataIndex="createBy" width={100} />
        <Table.Column
          width={130}
          title="createTime"
          dataIndex="createTime"
          sorter={(a, b) => a.latest_run_time.localeCompare(b.latest_run_time)}
        />

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
