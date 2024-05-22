import React, { lazy } from "react";
// import {
//   DashboardOutlined,
//   // DesktopOutlined,
//   CloudServerOutlined,
//   CodeOutlined,
//   // FlagOutlined,
//   ScheduleOutlined,
//   DeploymentUnitOutlined,
//   MonitorOutlined,
//   AlertOutlined,
//   SettingOutlined,
// } from "@ant-design/icons";

// import HomeIndex from "./pages/home";
// import DashboardIndex from "./pages/dashboard";
// import HostIndex from "./pages/host";
// import RawHostIndex from "./pages/rawhost";
// import ExecTask from "./pages/exec/task";
// import ExecTemplate from "./pages/exec/template";
// import ExecTransfer from "./pages/exec/transfer";
// import DeployApp from "./pages/deploy/app";
// import DeployRepository from "./pages/deploy/repository";
// import DeployRequest from "./pages/deploy/request";
// import ScheduleIndex from "./pages/schedule";
// import ConfigEnvironment from "./pages/config/environment";
// import ConfigService from "./pages/config/service";
// import ConfigApp from "./pages/config/app";
// import ConfigSetting from "./pages/config/setting";
// import MonitorIndex from "./pages/monitor";
// import ImageIndex from "./pages/images";
// import AlarmIndex from "./pages/alarm/alarm";
// import AlarmGroup from "./pages/alarm/group";
// import AlarmContact from "./pages/alarm/contact";
// import SystemAccount from "./pages/system/account";
// import EnterpriseAccount from "./pages/system/enteraccount";
// import SystemRole from "./pages/system/role";
// import SystemSetting from "./pages/system/setting";
// import SystemLogin from "./pages/system/login";
// import WelcomeIndex from "./pages/welcome/index";
// import WelcomeInfo from "./pages/welcome/info";
// import HostSelection from "./pages/purchase";

import * as Icon from "@ant-design/icons";
// import gStore from "gStore";

// import i18next from "./i18next";
// const { t } = i18next;

export function transformTreeToRoutes(tree) {
  const iconToElement = (name) =>
    React.createElement(Icon && Icon[name], {
      style: { fontSize: "17px" },
    });
  return tree.map((node) => {
    const { component, path, children, meta } = node;
    let route = {
      title: meta.title,
      // auth: `${label.toLowerCase().replace(/\s/g, '.')}.${weight > 1 ? 'view' : 'manage'}`,
      path: `${path}`,
      // Assuming the components are imported elsewhere and can be referenced directly.
      // In a real-world scenario, you'd likely have a mapping function to map labels to components.
    };

    // If the node has children, we add a 'child' property with the transformed children.
    if (children && children.length > 0) {
      route.child = transformTreeToRoutes(children);
    }

    // first level menu don't have component
    if (component !== "Layout") {
      // route.component = import(`${component}/index.js`);
      route.component = lazy(() => import(`${component}/index.js`));
    }

    // Here we're assuming that icons are determined by some logic based on the label or other properties.
    // This is a placeholder and should be replaced with actual logic to determine the icon.
    route.icon = iconToElement(meta.icon || "CloudServerOutlined");

    return route;
  });
}

// Placeholder function for determining the icon. Replace with actual implementation.
// function getIconByLabel(label) {
//   // Example logic, replace with your own mapping from labels to icons.
//   // switch (label.toLowerCase()) {
//   //   case 'dashboard':
//   //     return <DashboardOutlined />;
//   //   case 'server management':
//   //     return <CloudServerOutlined />;
//   //   // Add more cases as needed...
//   //   default:
//   //     return null; // Or a default icon

//   // }

//   return <CloudServerOutlined />;
// }

// Usage:
// const routes = transformTreeToRoutes(gStore._getMenuList);

// export default [
//   // {icon: <DesktopOutlined/>, title: '工作台', path: '/home', component: HomeIndex},
//   {
//     icon: <DashboardOutlined />,
//     title: "Dashboard",
//     auth: "dashboard.dashboard.view",
//     path: "/dashboard",
//     component: DashboardIndex,
//   },
//   {
//     icon: <CloudServerOutlined />,
//     title: t("serverManagement"),
//     auth: "host.host.view",
//     path: "/host",
//     component: HostIndex,
//   },

//   {
//     icon: <CodeOutlined />,
//     title: t("batchExecution"),
//     auth: "exec.task.do|exec.template.view",
//     child: [
//       {
//         title: t("executeTasks"),
//         auth: "exec.task.do",
//         path: "/exec/task",
//         component: ExecTask,
//       },
//       // {title: '模板管理', auth: 'exec.template.view', path: '/exec/template', component: ExecTemplate},
//       {
//         title: t("fileDistribution"),
//         auth: "exec.transfer.do",
//         path: "/exec/transfer",
//         component: ExecTransfer,
//       },
//     ],
//   },
//   // {
//   //   icon: <FlagOutlined/>, title: '应用发布', auth: 'deploy.app.view|deploy.repository.view|deploy.request.view', child: [
//   //     {title: '发布配置', auth: 'deploy.app.view', path: '/deploy/app', component: DeployApp},
//   //     {title: '构建仓库', auth: 'deploy.repository.view', path: '/deploy/repository', component: DeployRepository},
//   //     {title: '发布申请', auth: 'deploy.request.view', path: '/deploy/request', component: DeployRequest},
//   //   ]
//   // },
//   // {
//   //   icon: <ScheduleOutlined/>,
//   //   title: '任务计划',
//   //   auth: 'schedule.schedule.view',
//   //   path: '/schedule',
//   //   component: ScheduleIndex
//   // },
//   // {
//   //   icon: <DeploymentUnitOutlined/>, title: '配置中心', auth: 'config.env.view|config.src.view|config.app.view', child: [
//   //     {title: '环境管理', auth: 'config.env.view', path: '/config/environment', component: ConfigEnvironment},
//   //     {title: '服务配置', auth: 'config.src.view', path: '/config/service', component: ConfigService},
//   //     {title: '应用配置', auth: 'config.app.view', path: '/config/app', component: ConfigApp},
//   //     {path: '/config/setting/:type/:id', component: ConfigSetting},
//   //   ]
//   // },
//   {
//     icon: <MonitorOutlined />,
//     title: t("monitoringCenter"),
//     auth: "monitor.monitor.view",
//     path: "/monitor",
//     component: MonitorIndex,
//   },
//   {
//     icon: <ScheduleOutlined />,
//     title: t("ImageManagement"),
//     auth: "monitor.monitor.view",
//     path: "/images",
//     component: ImageIndex,
//   },
//   {
//     icon: <DeploymentUnitOutlined />,
//     title: t("rawHostManagement"),
//     auth: "admin.only",
//     path: "/rawhost",
//     component: RawHostIndex,
//   },
//   {
//     icon: <AlertOutlined />,
//     title: t("hostbuy"),
//     auth: "hostselection",
//     path: "/hostselection",
//     component: HostSelection,
//   },
//   // {
//   //   icon: <AlertOutlined/>, title: '报警中心', auth: 'alarm.alarm.view|alarm.contact.view|alarm.group.view', child: [
//   //     {title: '报警历史', auth: 'alarm.alarm.view', path: '/alarm/alarm', component: AlarmIndex},
//   //     {title: '报警联系人', auth: 'alarm.contact.view', path: '/alarm/contact', component: AlarmContact},
//   //     {title: '报警联系组', auth: 'alarm.group.view', path: '/alarm/group', component: AlarmGroup},
//   //   ]
//   // },
//   {
//     icon: <SettingOutlined />,
//     title: t("userManagement"),
//     auth: "system.account.view|system.role.view|system.setting.view",
//     child: [
//       {
//         title: t("operateLogs"),
//         auth: "system.login.view",
//         path: "/system/login",
//         component: SystemLogin,
//       },
//       {
//         title: t("accountManagement"),
//         auth: "system.account.view",
//         path: "/system/account",
//         component: SystemAccount,
//       },
//       {
//         title: t("roleManagement"),
//         auth: "system.role.view",
//         path: "/system/role",
//         component: SystemRole,
//       },
//       {
//         title: t("enterpriseAccounts"),
//         auth: "system.enterpriseaccount.view",
//         path: "/system/enterprise",
//         component: EnterpriseAccount,
//       },
//       {
//         title: t("systemManagement"),
//         auth: "system.setting.view",
//         path: "/system/setting",
//         component: SystemSetting,
//       },
//     ],
//   },
//   // { path: "/welcome/index", component: WelcomeIndex },· ·
//   // { path: "/welcome/info", component: WelcomeInfo },
// ];
