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
    // http
    //   .get("/api/home/statistic/")
    //   .then((res) =>
    //     this.setState({
    //       res: {
    //         app: 0,
    //         host: 0,
    //         task: 0,
    //         detection: 0,
    //       },
    //     })
    //   )
    //   .finally(() => this.setState({ loading: false }));
    
    this.setState({
      loading: false,
      res: {
        app: 0,
        host: 0,
        task: 0,
        detection: 0,
      },
    });
  }

  render() {
    const { res, loading } = this.state;
    return (
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="主机"
              value={res.app}
              suffix={<span style={{ fontSize: 16 }}>台</span>}
              formatter={(v) => <a href="/deploy/app">{v}</a>}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="告警"
              value={res.host}
              suffix={<span style={{ fontSize: 16 }}>个</span>}
              formatter={(v) => <a href="/host">{v}</a>}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="运行中"
              value={res.task}
              suffix={<span style={{ fontSize: 16 }}>个</span>}
              formatter={(v) => <a href="/schedule">{v}</a>}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="离线中"
              value={res["detection"]}
              suffix={<span style={{ fontSize: 16 }}>项</span>}
              formatter={(v) => <a href="/monitor">{v}</a>}
            />
          </Card>
        </Col>
      </Row>
    );
  }
}
