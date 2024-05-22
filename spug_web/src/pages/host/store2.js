
import { observable, computed } from 'mobx';
// import { includes } from 'libs';

class Store {
  @observable rawTreeData = [];
  @observable rawRecords = [];
  @observable group = {};
  @observable onlySelf = false;

  @observable f_word;

  // @computed get records() {
  //   let records = this.rawRecords;
  //   if (this.f_word) {
  //     records = records.filter(x => {
  //       if (includes(x.name, this.f_word)) return true
  //       if (x.public_ip_address && includes(x.public_ip_address[0], this.f_word)) return true
  //       return !!(x.private_ip_address && includes(x.private_ip_address[0], this.f_word));
  //     });
  //   }
  //   return records
  // }

  @computed get dataSource() {
    let records = this.rawRecords;
    return records
  }

  _handle_filter_group = (treeData) => {
    const data = []
    for (let item of treeData) {
      const host_ids = this.counter[item.key]
      if (host_ids?.size > 0 || item.key === this.group.key) {
        item.children = this._handle_filter_group(item.children)
        data.push(item)
      }
    }
    return data
  }
}

export default new Store()
