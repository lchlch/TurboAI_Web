import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { Row, Col } from "antd";
// import { CodeOutlined } from "@ant-design/icons";
import { AuthDiv, Breadcrumb } from "components";
// import Group from "./Group";
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

  // function openTerminal() {
  //   window.open("/ssh");
  // }

  return (
    <AuthDiv>
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
        <Breadcrumb.Item>Buy Hosts</Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={12}>
        <Col span={24}>
          <div>
            <iframe
              title="test"
              // src="http://192.168.10.10:3000/d-solo/fdi6271ofeubke/all-cpu-info?orgId=1&from=now-12h&to=now&theme=light&panelId=1"
              src="http://192.168.10.10/mytest.html"
              width="100%"
              height="500px"
              frameBorder="0"
            ></iframe>
          </div>
        </Col>
        <Col span={24}>
          <h1>Hosts Available:</h1>
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
