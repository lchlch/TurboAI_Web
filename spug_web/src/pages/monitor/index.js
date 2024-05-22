import React from "react";
import { observer } from "mobx-react";
import { AuthDiv, Breadcrumb } from "components";
import ComTable from "./Table";
import ComForm from "./Form";
// import MonitorCard from './MonitorCard';
import store from "./store";

export default observer(function () {
  return (
    <AuthDiv>
      <Breadcrumb>
        <Breadcrumb.Item>homepage</Breadcrumb.Item>
        <Breadcrumb.Item>monitoring center</Breadcrumb.Item>
      </Breadcrumb>
      {/* <MonitorCard/> */}
      <AuthDiv auth="list">
        <ComTable />
        {store.formVisible && <ComForm />}
      </AuthDiv>
    </AuthDiv>
  );
});
