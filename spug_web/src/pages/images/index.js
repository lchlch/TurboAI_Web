import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { AuthDiv, Breadcrumb } from "components";
import ComTable from "./Table";
import ComForm from "./Form";
// import MonitorCard from "./MonitorCard";
import { http } from "libs";
import store from "./store";

export default observer(function () {
  // const [imageReleaseDic, setImageReleaseDic] = useState([]);

  useEffect(() => {
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
      });
  }, []);
  return (
    <AuthDiv>
      <Breadcrumb>
        <Breadcrumb.Item>homepage</Breadcrumb.Item>
        <Breadcrumb.Item>Image management</Breadcrumb.Item>
      </Breadcrumb>
      {/* <MonitorCard/> */}
      <AuthDiv auth="list">
        <ComTable />
        {store.formVisible && <ComForm />}
      </AuthDiv>
    </AuthDiv>
  );
});
