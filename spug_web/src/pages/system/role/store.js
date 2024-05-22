import { observable, computed } from "mobx";
import http from "libs/http";
// import codes from "./codes";
import lds from "lodash";
import { message } from "antd";

class Store {
  allPerms = {};
  initPerms = {};
  @observable records = [];
  @observable record = {};

  @observable deployRel = {};
  @observable isFetching = false;
  @observable formVisible = false;
  @observable pagePermVisible = false;
  @observable deployPermVisible = false;
  @observable hostPermVisible = false;

  @observable f_name;
  @observable submitPerms = false;

  @observable menus = [];
  @observable checkedKeys = [];
  @observable codes = [];
  @observable permissions = lds.cloneDeep(this.codes);

  @computed get dataSource() {
    let records = this.records;
    if (this.f_name)
      records = records.filter((x) =>
        x.name.toLowerCase().includes(this.f_name.toLowerCase())
      );
    return records;
  }

  constructor() {
    this.initPermissions();
  }

  @computed get idMap() {
    const tmp = {};
    for (let item of this.records) {
      tmp[item.roleId] = item;
    }
    return tmp;
  }

  fetchRecords = () => {
    this.isFetching = true;
    return http
      .get("/api/v1/system/role/list")
      .then((res) => (this.records = res))
      .finally(() => (this.isFetching = false));
  };

  // 目前菜单只设定三层，一级二级和按钮权限, 所以不用递归了，直接写。将后台返回的菜单数据转换成当前目录下codes.js一样的样式
  // M目录 C菜单 F按钮
  initMenusCodes = (menus) => {
    let codes = [];
    menus.forEach((module) => {
      const { label, id, children } = module;
      let destModule = {};
      destModule.label = label;
      destModule.key = id;
      destModule.pages = [];
      let level = 1;
      // 包含二级菜单
      if (children && children[0].children) {
        level = 2;
      }

      if (level === 1) {
        let permissions = module.children.map((perms) => {
          const { label, id } = perms;
          return { label: label, key: id };
        });
        destModule.pages = [
          {
            label: label,
            key: id,
            perms: permissions,
          },
        ];
      }

      if (level === 2) {
        let page = {};
        children.forEach((child) => {
          let { label, id } = child;
          page = {
            label: label,
            key: id,
          };
          let permissions = child?.children?.map((perms) => {
            const { label, id } = perms;
            return { label: label, key: id };
          });
          page.perms = permissions;
          destModule.pages.push(page);
        });
      }
      codes.push(destModule);
    });
    this.permissions = lds.cloneDeep(codes);
    return codes;
  };

  fetchMenusByRoleId = () => {
    this.isFetching = true;
    return http
      .get("/api/v1/system/user/getInfo")
      .then((res) => {
        const { user } = res;
        const roleId = user?.roleId;
        if (roleId) {
          http
            .get(`/api/v1/system/menu/roleMenuTreeselect/${roleId}`)
            .then((res) => {
              const { menus } = res;
              this.menus = menus;
              this.checkedKeys = new Set([]);
              this.codes = this.initMenusCodes(menus);
              this.initPermissions();
            })
            .catch((e) => {
              // message.error("get role menus error", e);
              console.error(e);
            });
        }
      })
      .finally(() => (this.isFetching = false));
  };

  initPermissions = () => {
    for (let mod of this.codes) {
      this.initPerms[mod.key] = {};
      for (let page of mod.pages) {
        this.initPerms[mod.key][page.key] = [];
        page.perms.forEach((perm) => {
          if (this.checkedKeys.has(perm.key)) {
            this.initPerms[mod.key][page.key].push(perm.key);
          }
        });
        this.allPerms[`${mod.key}.${page.key}`] = page.perms.map((x) => x.key);
      }
    }
  };

  showForm = (info = {}) => {
    this.formVisible = true;
    this.record = info;
    
    if (this.record.roleId) {
      http
        .get(`/api/v1/system/menu/roleMenuTreeselect/${this.record.roleId}`)
        .then((res) => {
          const { checkedKeys } = res;
          this.checkedKeys = new Set(checkedKeys);
          this.initPermissions();
          this.permissions = lds.merge({}, this.initPerms, info.page_perms);
        })
        .catch((e) => {
          message.error("get role menus error", e);
        });
    }
  };

  showPagePerm = (info, noChangeRecord) => {
    this.pagePermVisible = true;
    // 编辑
    if (!noChangeRecord) {
      this.record = info;
      this.submitPerms = true;
      if (this.record.roleId) {
        http
          .get(`/api/v1/system/menu/roleMenuTreeselect/${this.record.roleId}`)
          .then((res) => {
            const { checkedKeys } = res;
            this.checkedKeys = new Set(checkedKeys);
            this.initPermissions();
            this.permissions = lds.merge({}, this.initPerms, info.page_perms);
          })
          .catch((e) => {
            message.error("get role menus error", e);
          });
      }
    }
  };

  showDeployPerm = (info) => {
    this.record = info;
    this.deployPermVisible = true;

    this.deployRel = info.deploy_perms || {};
  };

  showHostPerm = (info) => {
    this.record = info;
    this.hostPermVisible = true;
  };
}

export default new Store();
