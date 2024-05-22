import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { Input } from "antd";
import { SearchForm, AuthDiv, Breadcrumb } from "components";
import ComTable from "./Table";
import ComForm from "./Form";
import PagePerm from "./PagePerm";
import DeployPerm from "./DeployPerm";
import HostPerm from "./HostPerm";
import store from "./store";

export default observer(function () {
  useEffect(() => {
    store.fetchMenusByRoleId();
  }, []);

  return (
    <AuthDiv>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>System Management</Breadcrumb.Item>
        <Breadcrumb.Item>Role Management</Breadcrumb.Item>
      </Breadcrumb>
      <AuthDiv auth="list">
        <SearchForm>
          <SearchForm.Item span={8} title="角色名称">
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
        {store.pagePermVisible && <PagePerm />}
        {store.deployPermVisible && <DeployPerm />}
        {store.hostPermVisible && <HostPerm />}
      </AuthDiv>
    </AuthDiv>
  );
});
