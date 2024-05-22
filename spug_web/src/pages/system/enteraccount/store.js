import { observable, computed } from "mobx";
import http from "libs/http";

class Store {
  @observable records = [];
  @observable record = {};
  @observable isFetching = true;
  @observable formVisible = false;
  @observable isEdit = false;

  @observable f_name;
  @observable f_status = "";

  @observable host_ids = []

  @computed get dataSource() {
    let records = this.records;
    if (this.f_name)
      records = records.filter((x) =>
        x.companyName.toLowerCase().includes(this.f_name.toLowerCase())
      );
    if (this.f_status)
      records = records.filter((x) => String(x.status) === this.f_status);
    return records;
  }

  fetchRecords = () => {
    this.isFetching = true;
    http
      .get("/api/v1/system/tenant/list")
      .then((res) => (this.records = res))
      .finally(() => (this.isFetching = false));
  };

  showForm = (info = {}) => {
    this.formVisible = true;
    this.record = info;
    if (Object.keys(info).length > 0) {
      this.isEdit = true;
    }
  };
}

export default new Store();
