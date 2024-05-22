import { observable, computed } from "mobx";
import { http, includes } from "libs";
// import moment from "moment";
import lds from "lodash";

class Store {
  autoReload = null;
  @observable records = [];
  @observable record = { imageRelease: 0 };
  @observable types = [];
  @observable groups = [];
  @observable overviews = [];
  @observable page = 0;
  @observable isFetching = false;
  @observable formVisible = false;
  @observable ovFetching = false;
  @observable isEdit = false;
  @observable currentId = "";

  @observable f_name;
  @observable f_type;
  @observable f_active = "";
  @observable f_group;
  @observable imageReleaseDic = [];

  @computed get dataSource() {
    let records = this.records;
    if (this.f_active)
      records = records.filter((x) => x.is_active === (this.f_active === "1"));
    if (this.f_name)
      records = records.filter((x) => includes(x.name, this.f_name));
    if (this.f_type)
      records = records.filter((x) => x.type_alias === this.f_type);
    if (this.f_group) records = records.filter((x) => x.group === this.f_group);
    return records;
  }

  @computed get ovDataSource() {
    let records = this.overviews;
    if (this.f_type) records = records.filter((x) => x.type === this.f_type);
    if (this.f_group) records = records.filter((x) => x.group === this.f_group);
    if (this.f_name)
      records = records.filter((x) => includes(x.name, this.f_name));
    return records;
  }

  resetValue = () => {
    this.record = { imageRelease: 0 };
    this.isEdit = false;
  };

  fetchRecords = () => {
    this.isFetching = true;
    http
      .get("/api/v1/server/image/list")
      .then((res) => {
        res.forEach((item) => {
          item.id = item.id.toString();
          item.imageReleaseLabel =
            this.imageReleaseDic.getValueLabel[item.imageRelease];
        });
        this.records = res;
        // this.groups = groups;
      })
      .finally(() => (this.isFetching = false));
  };

  fetchOverviews = () => {
    if (this.autoReload === false) return;
    this.ovFetching = true;
    return http
      .get("/api/monitor/overview/")
      .then((res) => (this.overviews = res))
      .finally(() => {
        this.ovFetching = false;
        if (this.autoReload) setTimeout(this.fetchOverviews, 5000);
      });
  };

  toNext() {
    this.ovFetching = true;
    let addOrEditUrl = this.isEdit ? http.put : http.post;
    return addOrEditUrl("/api/v1/server/imageList", { ...this.record })
      .then((res) => {
        if (res) {
          this.currentId = res.id;
        }
        this.page += 1;
      })
      .finally(() => {
        this.ovFetching = false;
        // this.page += 1;
        // if (this.autoReload) setTimeout(this.fetchOverviews, 5000)
      });
    // const {type, extra} = store.record;
    // if (!Number(extra) > 0) {
    //   if (type === '1' && extra) return message.error('请输入正确的响应时间')
    //   if (type === '2') return message.error('请输入正确的端口号')
    // }
  }

  showForm = (info) => {
    if (info) {
      this.record = lds.cloneDeep(info);
      this.isEdit = true;
      this.currentId = info.id;
      this.currentInfo = info;
    } else {
      this.isEdit = false;
    }
    this.page = 0;
    this.formVisible = true;
  };
}

export default new Store();
