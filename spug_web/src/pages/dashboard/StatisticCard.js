import React from "react";
import { Statistic, Card, Row, Col } from "antd";
import { http } from "libs";

export default class StatisticCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      res: {},
    };
  }

  componentDidMount() {
    let tAgentNum = 0;
    let hostNum = 0;
    let lostNum = 0;
    http
      .get("/api/v1/server/host/list")
      .then((res) => {
        // const tmp = {};
        // let rawRecords = res.map((item) => {
        //   item.id = item.id.toString();
        //   if (item.hostStatus == 0) {
        //     tAgentNum++;
        //   }
        //   hostNum++;
        //   if (item.hostStatus == 3) {
        //     lostNum++;
        //   }

        //   return item;
        // });
        this.setState({
          res: {
            ...this.state.res,
            hostNum: hostNum,
            tAgentNum: tAgentNum,
            lostNum: lostNum,
          },
        });
      })
      .finally(() => (this.isFetching = false));

    http
      .get("/api/v1/prometheus/alerts")
      .then((res) => {
        let rules = res?.data?.groups[0]?.rules;
        let warningNum = 0;
        if (rules.length > 0) {
          rules.forEach((item) => {
            warningNum += item.alerts.length;
          });
        }
        this.setState({
          res: {
            ...this.state.res,
            host: warningNum,
          },
        });
      })
      .finally(() => (this.isFetching = false));

    this.setState({
      loading: false,
    });
  }

  render() {
    const { res, loading } = this.state;
    return (
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="Hosts"
              value={res.hostNum}
              suffix={<span style={{ fontSize: 16 }}></span>}
              formatter={(v) => <a href="/host">{v}</a>}
              valueStyle={{
                color: "#cf1322",
              }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="Warnings"
              value={res.host}
              suffix={<span style={{ fontSize: 16 }}></span>}
              formatter={(v) => <a href="/monitor">{v}</a>}
              valueStyle={{
                color: "red",
              }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="Tagent Monitoring"
              value={res.tAgentNum}
              suffix={<span style={{ fontSize: 16 }}></span>}
              formatter={(v) => <a href="/host">{v}</a>}
              valueStyle={{
                color: "#cf1322",
              }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="Outline"
              value={res["lostNum"]}
              suffix={<span style={{ fontSize: 16 }}></span>}
              formatter={(v) => <a href="/host">{v}</a>}
              valueStyle={{
                color: "#cf1322",
              }}
            />
          </Card>
        </Col>
      </Row>
    );
  }
}
