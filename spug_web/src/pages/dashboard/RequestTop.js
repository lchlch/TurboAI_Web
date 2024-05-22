import React, { useState } from "react";
import { Card, DatePicker } from "antd";
// import { Chart, Geom, Axis, Tooltip } from "bizcharts";
import styles from "./index.module.css";
import moment from "moment";
// import { http } from "libs";

export default function () {
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState([moment(), moment()]);
  const [range, setRange] = useState("12");
  const [warningUrl, setWarningUrl] = useState(
    "http://192.168.10.10:3000/d-solo/fdi7pnotkbt34a/new-dashboard?orgId=1&from=now-12h&to=now&panelId=2&theme=light"
  );

  // useEffect(() => {
  //   setLoading(true);
  //   const strDuration = duration.map(x => x.format('YYYY-MM-DD'))
  //   http.post('/api/home/request/', {duration: strDuration})
  //     .then(res => setRes(res))
  //     .finally(() => setLoading(false))
  // }, [duration])

  function handleClick(val) {
    setLoading(false);
    // let orginUrl = "http://192.168.10.10:3000/d-solo/fdi6271ofeubke/all-cpu-info?orgId=1&theme=light&panelId=2"
    let orginUrl =
      "http://192.168.10.10:3000/d-solo/fdi7pnotkbt34a/new-dashboard?orgId=1&theme=light&panelId=2";
    let duration = [];
    switch (val) {
      case "12":
        setRange("12");
        setWarningUrl(`${orginUrl}&from=now-12h&to=now`);
        duration = [moment(), moment()];
        break;
      case "day":
        setRange("day");
        setWarningUrl(`${orginUrl}&from=now-1d&to=now`);
        duration = [moment(), moment()];
        break;
      case "week":
        setRange("week");
        setWarningUrl(`${orginUrl}&from=now-1w&to=now`);
        duration = [moment().weekday(0), moment().weekday(6)];
        break;
      case "month":
        setRange("month");
        setWarningUrl(`${orginUrl}&from=now-30d&to=now`);
        const s_date = moment().startOf("month");
        const e_date = moment().endOf("month");
        duration = [s_date, e_date];
        break;
      default:
        setRange("custom");
        duration = val;
        let [start, end] = duration;
        let startStr = start.unix();
        let endStr = end.unix();
        setWarningUrl(`${orginUrl}&from=${startStr}000&to=${endStr}000`);
    }
    setDuration(duration);
  }

  return (
    <Card
      loading={loading}
      title="Warnings"
      style={{ marginTop: 20 }}
      bodyStyle={{ height: 353 }}
      extra={
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            className={
              range === "12" ? styles.spanButtonActive : styles.spanButton
            }
            onClick={() => handleClick("12")}
          >
            Within 12h
          </span>
          <span
            className={
              range === "day" ? styles.spanButtonActive : styles.spanButton
            }
            onClick={() => handleClick("day")}
          >
            Today
          </span>
          <span
            className={
              range === "week" ? styles.spanButtonActive : styles.spanButton
            }
            onClick={() => handleClick("week")}
          >
            This Week
          </span>
          <span
            className={
              range === "month" ? styles.spanButtonActive : styles.spanButton
            }
            onClick={() => handleClick("month")}
          >
            This Month
          </span>
          <DatePicker.RangePicker
            allowClear={false}
            style={{ width: 250 }}
            value={duration}
            onChange={handleClick}
          />
        </div>
      }
    >
      {/* <Chart height={300} data={res} padding={[10, 0, 30, 35]} scale={{count: {alias: '发布申请数量'}}} forceFit>
        <Axis name="name"/>
        <Axis name="count" title/>
        <Tooltip/>
        <Geom type="interval" position="name*count"/>
      </Chart> */}
      <iframe
        title="warningurl"
        src={warningUrl}
        width="100%"
        height="100%"
        frameBorder="0"
      ></iframe>
      {/* <iframe src="http://192.168.10.10:3000/d-solo/fdi7pnotkbt34a/new-dashboard?orgId=1&from=1712622971533&to=1712666171533&panelId=2" width="450" height="200" frameBorder="0"></iframe> */}
    </Card>
  );
}
