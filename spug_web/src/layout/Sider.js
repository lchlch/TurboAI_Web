import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import { hasPermission } from "libs";
import styles from "./layout.module.less";
// import routes from "../routes";
import { transformTreeToRoutes } from "../routes";
import gStore from "gStore";
import logo from "./logo-TurboAI-white.svg";
import onlylog from "./onlylogowhite.svg";
import { useHistory } from "react-router-dom";

export default function Sider(props) {
  const [openKeys, setOpenKeys] = useState([]);
  const [menus, setMenus] = useState([]);

  // const [OpenKeysMap, setOpenKeysMap] = useState({});
  const [selectedKey, setSelectedKey] = useState("");

  const history = useHistory();

  useEffect(() => {
    // 在路由变化时执行的操作
    const unlisten = history.listen((location, action) => {
      const tmp = location.pathname;
      // const openKey = OpenKeysMap[tmp];
      setSelectedKey(tmp);
    });
    return () => {
      unlisten();
    };
  }, [history]);

  function handleMenu(routes) {
    const tmp = [];
    for (let item of routes) {
      const menu = handleRoute(item);
      tmp.push(menu);
    }
    setMenus(tmp);

    const OpenKeysMapTmp = {};
    for (let item of routes) {
      if (item.child) {
        for (let sub of item.child) {
          if (sub.title) OpenKeysMapTmp[sub.path] = item.path;
        }
      } else if (item.title) {
        OpenKeysMapTmp[item.path] = 1;
      }
    }
    const openKey = OpenKeysMapTmp[window.location.pathname];
    if (openKey) {
      if (openKey !== 1 && !props.collapsed && !openKeys.includes(openKey)) {
        setOpenKeys([...openKeys, openKey]);
      }
    }
    // setOpenKeysMap(OpenKeysMapTmp);
    setSelectedKey(window.location.pathname);
  }

  useEffect(() => {
    if (gStore.menuList.length === 0) {
      let routes = [];
      gStore._getMenuList().then(() => {
        routes = transformTreeToRoutes(gStore.menuList);
        handleMenu(routes);
      });
    } else {
      handleMenu(transformTreeToRoutes(gStore.menuList));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleRoute(item) {
    if (item.auth && !hasPermission(item.auth)) return;
    if (!item.title) return;
    const menu = { label: item.title, key: item.path, icon: item.icon };
    if (item.child) {
      menu.children = [];
      for (let sub of item.child) {
        const subMenu = handleRoute(sub);
        menu.children.push(subMenu);
      }
    }
    return menu;
  }

  return (
    <Layout.Sider
      width={208}
      collapsed={props.collapsed}
      className={styles.sider}
    >
      <div className={styles.logo}>
        {props.collapsed ? (
          <img src={onlylog} alt="Logo" />
        ) : (
          <img src={logo} alt="Logo" />
        )}
      </div>
      <div
        className={styles.menus}
        style={{ height: `${document.body.clientHeight - 64}px` }}
      >
        <Menu
          theme="dark"
          mode="inline"
          items={menus}
          className={styles.menus}
          selectedKeys={[selectedKey]}
          openKeys={openKeys}
          onOpenChange={setOpenKeys}
          onSelect={(menu) => history.push(menu.key)}
        />
      </div>
    </Layout.Sider>
  );
}
