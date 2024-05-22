import React, { useState, useEffect } from "react";
import { http } from "libs";

export default function () {
  const [loading, setLoading] = useState("true");
  // const [params, setParams] = useState({});
  const [hostUrl, setHostUrl] = useState(
    "http://192.168.10.10:3000/d/xfpJB9FGz/node-exporter-dashboard-en-20201010-starsl-cn?orgId=1&var-origin_prometheus=&var-job=nodeexporter&var-hostname=All&var-device=All&var-interval=2m&var-maxmount=%2Fhome&var-show_hostname=localhost.localdomain&from=now-6h&to=now&theme=light&kiosk"
  );

  // &var-node=192.168.10.10:9100&var-node=192.168.10.11:9100&var-node=192.168.10.12:9100
  useEffect(() => {
    setLoading("true");
    let url =
      "http://192.168.10.10:3000/d/xfpJB9FGz/node-exporter-dashboard-en-20201010-starsl-cn?orgId=1&var-origin_prometheus=&var-job=nodeexporter&var-hostname=All&var-device=All&var-interval=2m&var-maxmount=%2Fhome&var-show_hostname=localhost.localdomain&from=now-12h&to=now&theme=light&kiosk";
    let count = 0;
    http
      .get("/api/v1/server/host/list")
      .then((res) => {
        let hostIpList = res.map((item) => (item.ip ? item.ip : null));
        hostIpList.forEach((ip) => {
          if (ip) {
            url += `&var-node=${ip}:9100`;
            count++;
          }
        });
        setHostUrl(`${url}&var-total=${count}`);
      })
      .finally(() => {
        setLoading("false");
      });
    setLoading("false");
  }, []);

  // useEffect(() => {
  //   const data = {};
  //   http.get("/api/monitor/").then((res) => {
  //     for (let item of res.detections) {
  //       if (!data[item.type]) {
  //         data[item.type] = {
  //           value: item.type_alias,
  //           label: item.type_alias,
  //           children: [],
  //         };
  //       }
  //       data[item.type].children.push({ value: item.name, label: item.name });
  //     }
  //     setOptions(Object.values(data));
  //   });
  // }, []);

  // function handleChange(v) {
  //   switch (v.length) {
  //     case 2:
  //       setParams({ name: v[1] });
  //       break;
  //     case 1:
  //       setParams({ type: v[0] });
  //       break;
  //     default:
  //       setParams({});
  //   }
  // }

  return (
    <div
      loading={loading}
      style={{ height: "100vh", margin: "-16px" }}
      // extra={
      //   <Cascader
      //     changeOnSelect
      //     style={{ width: 260 }}
      //     options={options}
      //     onChange={handleChange}
      //     placeholder="过滤监控项，默认所有"
      //   />
      // }
    >
      {/* <Chart height={300} data={res} padding={[10, 10, 30, 35]} scale={{value: {alias: '报警次数'}}} forceFit>
        <Axis name="date"/>
        <Axis name="value"/>
        <Tooltip
          crosshairs={{
            type: "y"
          }}
        />
        <Geom type="line" position="date*value" size={2} shape={"smooth"}/>
        <Geom
          type="point"
          position="date*value"
          size={4}
          shape={"circle"}
          style={{
            stroke: "#fff",
            lineWidth: 1
          }}
        />
      </Chart> */}
      {/* <iframe
        src="http://192.168.10.10:3000/d/fdi6271ofeubke/all-cpu-info?orgId=1&from=1712604624010&to=1712626224010&theme=light&viewPanel=1&kiosk"
        width="100%"
        height="100%"
        frameBorder="0"
      ></iframe> */}
      {/* <iframe
        // src="http://192.168.10.10:3000/d-solo/fdi6271ofeubke/all-cpu-info?orgId=1&from=now-12h&to=now&theme=light&panelId=1"
        src="http://192.168.10.10:3000/d/fdi7pnotkbt34a/new-dashboard?orgId=1&rom=now-24h&to=now&theme=light&viewPanel=1&kiosk"
        width="100%"
        height="100%"
        frameBorder="0"
      ></iframe> */}
      <iframe
        title="hosturl"
        // src="http://192.168.10.10:3000/d-solo/fdi6271ofeubke/all-cpu-info?orgId=1&from=now-12h&to=now&theme=light&panelId=1"
        src={hostUrl}
        width="100%"
        height="100%"
        frameBorder="0"
      ></iframe>
    </div>
  );
}
