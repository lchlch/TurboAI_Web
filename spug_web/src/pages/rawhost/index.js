import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { Row, Col } from "antd";
import { CodeOutlined } from "@ant-design/icons";
import { AuthDiv, Breadcrumb, AuthButton } from "components";
import Group from "./Group";
import ComTable from "./Table";
import ComForm from "./Form";
import ComImport from "./Import";
import CloudImport from "./CloudImport";
import BatchSync from "./BatchSync";
import Detail from "./Detail";
import Selector from "./Selector";
import store from "./store";

export default observer(function () {
  useEffect(() => {
    store.initial();
  }, []);

  function openTerminal() {
    window.open("/ssh");
  }

  return (
    <AuthDiv auth="host.host.view">
      <Breadcrumb
        // extra={
        //   <AuthButton
        //     auth="host.console.view|host.console.list"
        //     type="primary"
        //     icon={<CodeOutlined />}
        //     onClick={openTerminal}
        //   >
        //     Web SSH
        //   </AuthButton>
        // }
      >
        <Breadcrumb.Item>homepage</Breadcrumb.Item>
        <Breadcrumb.Item>host management </Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={12}>
        {/* <Col span={6}>
          <Group/>
        </Col> */}
        <Col span={24}>
          <ComTable />
        </Col>
      </Row>

      <Detail />
      {store.formVisible && <ComForm />}
      {store.importVisible && <ComImport />}
      {store.cloudImport && <CloudImport />}
      {store.syncVisible && <BatchSync />}
      {store.selectorVisible && (
        <Selector
          mode="group"
          onlySelf={!store.addByCopy}
          onCancel={() => (store.selectorVisible = false)}
          onChange={store.updateGroup}
        />
      )}
    </AuthDiv>
  );
});
