import React, { useState, useEffect } from "react";
import { Card, Cascader } from "antd";
import { Chart, Geom, Axis, Tooltip } from "bizcharts";
import { http } from "libs";

export default function () {
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState([]);
  const [params, setParams] = useState({});
  const [res, setRes] = useState([]);

  useEffect(() => {
    // setLoading(true);
    // http
    //   .get("/api/home/alarm/", { params })
    //   .then((res) => setRes(res))
    //   .finally(() => setLoading(false));
    setLoading(false)
  }, [params]);

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

  function handleChange(v) {
    switch (v.length) {
      case 2:
        setParams({ name: v[1] });
        break;
      case 1:
        setParams({ type: v[0] });
        break;
      default:
        setParams({});
    }
  }

  return (
    <Card
      loading={loading}
      title="主机cpu"
      bodyStyle={{ height: 353 }}
      extra={
        <Cascader
          changeOnSelect
          style={{ width: 260 }}
          options={options}
          onChange={handleChange}
          placeholder="过滤监控项，默认所有"
        />
      }
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
      <iframe
        src="http://8.130.51.9:3001/d-solo/9CWBzd1f0bik001/linuxe4b8bb-e69cba-e8afa6-e68385?orgId=1&from=1710931229680&to=1711017629680&theme=light&panelId=7"
        width="100%"
        height="100%"
        frameborder="0"
      ></iframe>
    </Card>
  );
}
