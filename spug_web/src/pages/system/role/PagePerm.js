import React from "react";
import { observer } from "mobx-react";
import { Modal, Checkbox, Row, Col, message, Alert } from "antd";
// import http from "libs/http";
import store from "./store";
// import codes from "./codes";
import styles from "./index.module.css";
import lds from "lodash";
import { uniqueId, http } from "libs";

@observer
class PagePerm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }


  handleSubmit = () => {
    if (store.submitPerms) {
      this.setState({ loading: true });
      const httpMethod = store.record.roleId ? http.put : http.post;

      store.record.menuIds = Array.from(store.checkedKeys);
      store.record.roleKey = uniqueId();
      httpMethod("/api/v1/system/role", store.record).then(
        (res) => {
          message.success("操作成功");
          store.formVisible = false;
          store.fetchRecords();
        },
        () => this.setState({ loading: false })
      );
    }
    store.pagePermVisible = false;
    store.submitPerms = false;
  };

  handleAllCheck = (e, mod, page) => {
    const checked = e.target.checked;
    const key = `${mod}.${page}`;
    let ids = lds.clone(store.allPerms[key]);
    if (checked) {
      ids.forEach((id) => {
        store.checkedKeys.add(id);
      });
      store.checkedKeys.add(page);
      store.permissions[mod][page] = lds.clone(store.allPerms[key]);
    } else {
      // store.permissions[mod][page] = [];
      ids.forEach((id) => {
        store.checkedKeys.delete(id);
      });
      store.checkedKeys.delete(page);
    }
  };

  handlePermCheck = (mod, page, perm) => {
    const perms = store.permissions[mod][page]
    if (store.checkedKeys.has(perm)) {
      store.checkedKeys.delete(perm);
      perms.splice(perms.indexOf(perm), 1);
      if(perms.length === 0) {
        store.checkedKeys.delete(page);
      }
    } else {
      store.checkedKeys.add(perm);
      store.checkedKeys.add(page);
      perms.push(perm);
    }

    // const perms = store.permissions[mod][page];
    // if (perms.includes(perm)) {
    //   perms.splice(perms.indexOf(perm), 1);
    // } else {
    //   perms.push(perm);
    // }
  };

  PermBox = observer(({ mod, page, perm, children }) => {
    return (
      <Checkbox
        value={perm}
        onChange={() => this.handlePermCheck(mod, page, perm)}
        checked={store.checkedKeys.has(perm)}
      >
        {children}
      </Checkbox>
    );
  });

  render() {
    const PermBox = this.PermBox;
    return (
      <Modal
        visible
        width={1000}
        maskClosable={false}
        title="功能权限设置"
        className={styles.container}
        onCancel={() => {
          store.pagePermVisible = false;
          store.checkedKeys = new Set();
          store.submitPerms = false;
        }}
        confirmLoading={this.state.loading}
        onOk={this.handleSubmit}
      >
        <Alert
          closable
          showIcon
          type="info"
          style={{ marginBottom: 12 }}
          message="权限更改成功后会，属于该角色的账户请重新登录后生效。"
        />
        <table border="1" bordercolor="#dfdfdf" className={styles.table}>
          <thead>
            <tr>
              <th>模块</th>
              <th>页面</th>
              <th>功能</th>
            </tr>
          </thead>
          <tbody>
            {store.codes.map((mod) =>
              mod.pages.map((page, index) => (
                <tr key={page.key}>
                  {index === 0 && (
                    <td rowSpan={mod.pages.length}>{mod.label}</td>
                  )}
                  <td>
                    <Checkbox
                      checked={store.checkedKeys.has(page.key)}
                      onChange={(e) =>
                        this.handleAllCheck(e, mod.key, page.key)
                      }
                    >
                      {page.label}
                    </Checkbox>
                  </td>
                  <td>
                    <Row>
                      {page.perms.map((perm) => (
                        <Col key={perm.key} span={8}>
                          <PermBox
                            mod={mod.key}
                            page={page.key}
                            perm={perm.key}
                          >
                            {perm.label}
                          </PermBox>
                        </Col>
                      ))}
                    </Row>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Modal>
    );
  }
}

export default PagePerm;
