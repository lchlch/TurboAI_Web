
import React from 'react';
import { observer } from 'mobx-react';
import { Modal, Steps } from 'antd';
import Step1 from './Step1';
import Step2 from './Step2';
import store from './store';
import styles from './index.module.less';
// import groupStore from '../alarm/group/store';

export default observer(function () {
  // useEffect(() => {
  //   if (groupStore.records.length === 0) {
  //     groupStore.fetchRecords();
  //   }
  // }, [])

  return (
    <Modal
      visible
      width={800}
      maskClosable={false}
      title={store.record.id ? 'edit' : 'new'}
      onCancel={() => store.formVisible = false}
      footer={null}>
      <Steps current={store.page} className={styles.steps}>
        <Steps.Step key={0} title="new task"/>
        <Steps.Step key={1} title="set rules"/>
      </Steps>
      {store.page === 0 && <Step1/>}
      {store.page === 1 && <Step2/>}
    </Modal>
  )
})
