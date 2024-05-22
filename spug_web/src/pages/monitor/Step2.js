import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import { Form,  Radio, Button, message } from "antd";
import { http } from "libs";
// import groupStore from "../alarm/group/store";
import store from "./store";
import lds from "lodash";

// const modeOptions = [
//   { label: "微信", value: "1" },
//   { label: "短信", value: "2" },
//   { label: "电话", value: "6" },
//   { label: "邮件", value: "4" },
//   { label: "钉钉", value: "3" },
//   { label: "企业微信", value: "5" },
// ];

export default observer(function () {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { type, addr } = store.record;
    if (type === "1" && addr) {
      store.record.sitePrefix = addr.startsWith("http://")
        ? "http://"
        : "https://";
      store.record.domain = store.record.addr.replace(
        store.record.sitePrefix,
        ""
      );
    }
  }, []);

  function handleSubmit() {
    setLoading(true);
    const formData = form.getFieldsValue();
    Object.assign(
      formData,
      lds.pick(store.record, [
        "id",
        "alert",
        "description",
        "expr",
        "extra",
        "type",
        "group",
      ])
    );
    formData["id"] = store.record.id;
    let httpMethod = http.post;
    if (store.isEdit) {
      httpMethod = http.put;
    }
    httpMethod("/api/v1/prometheus/alerts", formData).then(
      () => {
        message.success("操作成功");
        store.record = {};
        store.formVisible = false;
        setTimeout(() => {
          store.fetchRecords();
        }, 1000);
        // store.fetchOverviews()
      },
      () => setLoading(false)
    );
  }

  function canNext() {
    const { notify_grp, notify_mode } = form.getFieldsValue();
    return (
      true ||
      (notify_grp && notify_grp.length && notify_mode && notify_mode.length)
    );
  }

  const info = store.record;
  return (
    <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
      <Form.Item
        name="rate"
        initialValue={info.rate || 5}
        label="Monitoring frequency"
        tooltip="Check every n minutes"
      >
        <Radio.Group>
          <Radio value={1}>1 minutes</Radio>
          <Radio value={5}>5 minutes</Radio>
          <Radio value={15}>15 minutes</Radio>
          <Radio value={30}>30 minutes</Radio>
          <Radio value={60}>60 minutes</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name="threshold"
        initialValue={info.threshold || 3}
        label="threshold"
        tooltip="Send an alarm if N consecutive detections fail"
      >
        <Radio.Group>
          <Radio value={1}>1 time</Radio>
          <Radio value={2}>2 time</Radio>
          <Radio value={3}>3 time</Radio>
          <Radio value={4}>4 time</Radio>
          <Radio value={5}>5 time</Radio>
        </Radio.Group>
      </Form.Item>
      {/* <Form.Item required name="notify_grp" valuePropName="targetKeys" initialValue={info.notify_grp} label="报警联系人组"
                 extra={<>去创建 <Link to="/alarm/contact">报警联系人</Link> 和 <Link to="/alarm/group">联系人组</Link>。</>}>
        <Transfer
          lazy={false}
          rowKey={item => item.id}
          titles={['已有联系组', '已选联系组']}
          listStyle={{width: 199}}
          dataSource={groupStore.records}
          render={item => item.name}/>
      </Form.Item> */}
      {/* <Form.Item required name="notify_mode" initialValue={info.notify_mode} label="报警方式">
        <Checkbox.Group options={modeOptions}/>
      </Form.Item>
      <Form.Item name="quiet" initialValue={info.quiet || 24 * 60} label="通道沉默" extra="相同的告警信息，沉默期内只发送一次。">
        <Select placeholder="请选择">
          <Select.Option value={5}>5分钟</Select.Option>
          <Select.Option value={10}>10分钟</Select.Option>
          <Select.Option value={15}>15分钟</Select.Option>
          <Select.Option value={30}>30分钟</Select.Option>
          <Select.Option value={60}>60分钟</Select.Option>
          <Select.Option value={3 * 60}>3小时</Select.Option>
          <Select.Option value={6 * 60}>6小时</Select.Option>
          <Select.Option value={12 * 60}>12小时</Select.Option>
          <Select.Option value={24 * 60}>24小时</Select.Option>
        </Select>
      </Form.Item> */}
      <Form.Item
        shouldUpdate
        wrapperCol={{ span: 14, offset: 6 }}
        style={{ marginTop: 12 }}
      >
        {() => (
          <React.Fragment>
            <Button
              disabled={!canNext()}
              loading={loading}
              type="primary"
              onClick={handleSubmit}
            >
              提交
            </Button>
            <Button
              style={{ marginLeft: 20 }}
              onClick={() => (store.page -= 1)}
            >
              上一步
            </Button>
          </React.Fragment>
        )}
      </Form.Item>
    </Form>
  );
});
