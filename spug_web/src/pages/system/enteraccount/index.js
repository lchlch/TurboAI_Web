import React from "react";
import { observer } from "mobx-react";
import { Input } from "antd";
import { SearchForm, AuthDiv, Breadcrumb } from "components";
import ComTable from "./Table";
import ComForm from "./Form";
import store from "./store";

export default observer(function () {
  return (
    <AuthDiv auth="list">
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>System Management</Breadcrumb.Item>
        <Breadcrumb.Item>Enterprise Managemenr</Breadcrumb.Item>
      </Breadcrumb>
      <AuthDiv auth="list">
        <SearchForm>
          <SearchForm.Item span={8} title="账户名称">
            <Input
              allowClear
              value={store.f_name}
              onChange={(e) => (store.f_name = e.target.value)}
              placeholder="请输入"
            />
          </SearchForm.Item>
        </SearchForm>
        <ComTable />
        {store.formVisible && <ComForm />}
      </AuthDiv>
    </AuthDiv>
  );
});
