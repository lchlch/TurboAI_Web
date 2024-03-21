import { observable, computed } from "mobx";
import { http, includes } from "libs";
import moment from "moment";
import lds from "lodash";

class Store {
  autoReload = null;
  @observable records = [];
  @observable record = {};
  @observable types = [];
  @observable groups = [];
  @observable overviews = [];
  @observable page = 0;
  @observable isFetching = false;
  @observable formVisible = false;
  @observable ovFetching = false;
  @observable isEdit = false;
  @observable currentId = '';


  @observable f_name;
  @observable f_type;
  @observable f_active = "";
  @observable f_group;

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

  fetchRecords = () => {
    this.isFetching = true;
    http
      .get("/api/v1/dao/imageList/list")
      .then((res) => {
        // const newJsonStr = 
        // res.forEach(item => {
        //   JsonBigint.parse(item).then(res => console.log(res))
        // })
        // console.log(newJsonStr); //打印的内容如下图?
        //最后使用toString()方法便能的到原来正确的数据了
        // console.log(newJsonStr.id.toString()); //这个就是和原来相同的数据了
        // console.log(res);
        // const tmp = new Set();
        // detections.map(item => {
        //   tmp.add(item['type_alias']);
        //   const value = item['latest_run_time'];
        //   item['latest_run_time_alias'] = value ? moment(value).fromNow() : null;
        //   return null
        // });
        // this.types = Array.from(tmp);
        res.forEach((item) => {
          item.id = item.id.toString();
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
    return addOrEditUrl("/api/v1/dao/imageList", { ...this.record })
      .then((res) => {
        if(res) {
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
      this.currentId = info.id
    } else {
      this.isEdit = false;
    }
    this.page = 0;
    this.formVisible = true;
  };
}

export default new Store();
