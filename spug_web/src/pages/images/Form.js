
import React, {useEffect} from 'react';
import { observer } from 'mobx-react';
import { Modal, Steps } from 'antd';
import Step1 from './Step1';
import Step2 from './Step2';
import store from './store';
import styles from './index.module.less';
import groupStore from '../alarm/group/store';

export default observer(function () {
  useEffect(() => {
    // if (groupStore.records.length === 0) {
    //   groupStore.fetchRecords();
    // }
  }, [])

  return (
    <Modal
      visible
      width={800}
      maskClosable={false}
      title={store.record.id ? '编辑镜像' : '新建镜像'}
      onCancel={() => store.formVisible = false}
      footer={null}>
      <Steps current={store.page} className={styles.steps}>
        <Steps.Step key={0} title="创建镜像"/>
        <Steps.Step key={1} title="上传镜像"/>
      </Steps>
      {store.page === 0 && <Step1/>}
      {store.page === 1 && <Step2/>}
    </Modal>
  )
})
