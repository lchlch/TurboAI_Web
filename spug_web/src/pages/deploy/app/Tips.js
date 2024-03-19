
import React from 'react';
import { Tooltip } from 'antd';

const Tips1 = (
  <a
    target="_blank"
    rel="noopener noreferrer"
    href="https://TurboAI.cc/docs/deploy-config#global-env">内置全局变量</a>
)

const Tips2 = (
  <Tooltip title="配置中心应用的配置将会以 _TurboAI_标识符_Key 方式组合成环境变量，可通过执行 env | grep TurboAI 来查看所有的内置的和配置中心的可使用变量。">
    <span style={{color: '#2563fc'}}>配置中心的配置变量</span>
  </Tooltip>
)

export default (
  <span>可使用 {Tips1} 和 {Tips2}</span>
)