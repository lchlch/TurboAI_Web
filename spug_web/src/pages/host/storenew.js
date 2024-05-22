
import { observable, computed, toJS } from 'mobx';
import { message } from 'antd';
import { http } from 'libs';

class Store {
  @observable rawTreeData = [];
  @observable rawRecords = [];
  @observable groups = {};
  @observable group = {};
  @observable record = {};
  @observable idMap = {};
  @observable addByCopy = true;
  @observable grpFetching = true;
  @observable isFetching = false;
  @observable formVisible = false;
  @observable importVisible = false;
  @observable syncVisible = false;
  @observable logVisible = false;
  @observable cloudImport = null;
  @observable detailVisible = false;
  @observable selectorVisible = false;
  @observable isEdit = false;
  @observable show = 0; // 0 正常表格， 1 webssh, 2 wenjian, 3 grafana
  @observable buildOsForm = 0; // 0 不展示， 1 新装机, 2 重装
  @observable isBuildingOS = false;

  @observable curOperationHostInfo = {};

  @observable hostStatus = 0;
  @observable isDisabled = false;

  @observable f_word;
  @observable f_status = '';

  @computed get records() {
    let records = this.rawRecords;
    // if (this.f_word) {
    //   records = records.filter(x => {
    //     if (includes(x.name, this.f_word)) return true
    //     if (x.public_ip_address && includes(x.public_ip_address[0], this.f_word)) return true
    //     return !!(x.private_ip_address && includes(x.private_ip_address[0], this.f_word));
    //   });
    // }
    return records
  }

  @computed get dataSource() {
    return this.records
  }

  @computed get counter() {
    const counter = {}
    for (let host of this.records) {
      for (let hostId of host.group_ids) {
        if (counter[hostId]) {
          counter[hostId].add(host.hostId)
        } else {
          counter[hostId] = new Set([host.hostId])
        }
      }
    }
    for (let item of this.rawTreeData) {
      this._handler_counter(item, counter)
    }
    return counter
  }

  @computed get treeData() {
    let treeData = toJS(this.rawTreeData)
    if (this.f_word) {
      treeData = this._handle_filter_group(treeData)
    }
    return treeData
  }

  fetchRecords = () => {
    this.isFetching = true;
    return http.get('/api/v1/server/host/list')
      .then(res => {
        // const tmp = {};
        this.rawRecords = res.map(item => {
          item.hostId = item.hostId.toString()
          return item;
        });
      })
      .finally(() => this.isFetching = false)
  };

  fetchExtend = (hostId) => {
    http.put('/api/host/', {hostId})
      .then(() => this.fetchRecords())
  }

  fetchGroups = () => {
    this.grpFetching = true;
    return http.get('/api/host/group/')
      .then(res => {
        this.groups = res.groups;
        this.rawTreeData = res.treeData
      })
      .finally(() => this.grpFetching = false)
  }

  initial = () => {
    if (this.rawRecords.length > 0) return Promise.resolve()
    this.isFetching = true;
    this.grpFetching = true;
    return http.get('/api/v1/server/host/list')
      .then((res1) => {
        this.rawRecords = res1.map(item => {
          item.hostId = item.hostId.toString()
          return item;
        });
      })
      .finally(() => {
        this.isFetching = false;
        this.grpFetching = false
      })
  }

  updateGroup = (group, host_ids) => {
    const form = {host_ids, s_group_id: group.key, t_group_id: this.group.key, is_copy: this.addByCopy};
    return http.patch('/api/host/', form)
      .then(() => {
        message.success('success');
        this.fetchRecords()
      })
  }

  showForm = (info) => {
    this.formVisible = true;
    if(info) {
      this.record = info
      this.isEdit = true;
    }
  }

  showSync = () => {
    this.syncVisible = !this.syncVisible
  }

  showDetail = (info) => {
    this.record = info;
    this.detailVisible = true;
  }

  showSelector = (addByCopy) => {
    this.addByCopy = addByCopy;
    this.selectorVisible = true;
  }

  _handler_counter = (item, counter) => {
    if (!counter[item.key]) counter[item.key] = new Set()
    for (let child of item.children) {
      this._handler_counter(child, counter)
      counter[child.key].forEach(x => counter[item.key].add(x))
    }
  }

  _handle_filter_group = (treeData) => {
    const data = []
    for (let item of treeData) {
      const host_ids = this.counter[item.key]
      if (host_ids.size > 0 || item.key === this.group.key) {
        item.children = this._handle_filter_group(item.children)
        data.push(item)
      }
    }
    return data
  }
}

export default new Store()
