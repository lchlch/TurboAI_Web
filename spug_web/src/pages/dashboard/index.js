import React from "react";
import { AuthDiv } from "components";
import StatisticsCard from "./StatisticCard";
import AlarmTrend from "./AlarmTrend";
import RequestTop from "./RequestTop";
import { http } from "libs";
import { Empty } from "antd";

class HomeIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasHosts: true,
    };
  }
  componentDidMount() {
    http
      .get("/api/v1/server/host/list")
      .then((res) => {
        // const tmp = {};
        if (res.length > 0) {
          this.setState({ hasHosts: true });
        } else {
          this.setState({ hasHosts: false });
        }
      })
      .finally(() => (this.isFetching = false));

    this.setState({
      loading: false,
    });
  }
  render() {
    const { hasHosts } = this.state;
    return (
      <AuthDiv>
        {!hasHosts && <Empty />}
        {hasHosts && <StatisticsCard />}
        {hasHosts && <AlarmTrend />}
        {hasHosts && <RequestTop />}
      </AuthDiv>
    );
  }
}

export default HomeIndex;
