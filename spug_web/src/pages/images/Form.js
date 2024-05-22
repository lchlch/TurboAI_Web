
import React, {useEffect} from 'react';
import { observer } from 'mobx-react';
import { Modal, Steps } from 'antd';
import Step1 from './Step1';
import Step2 from './Step2';
import store from './store';
import styles from './index.module.less';

export default observer(function () {
  useEffect(() => {
    // if (groupStore.records.length === 0) {
    //   groupStore.fetchRecords();
    // }
  }, [])

  const onCancel = () => {
    store.formVisible = false
    store.resetValue()
  }

  return (
    <Modal
      visible
      width={800}
      maskClosable={false}
      title={store.record.id ? 'edit' : 'new'}
      onCancel={onCancel}
      footer={null}>
      <Steps current={store.page} className={styles.steps}>
        <Steps.Step key={0} title="new"/>
        <Steps.Step key={1} title="upload"/>
      </Steps>
      {store.page === 0 && <Step1/>}
      {store.page === 1 && <Step2/>}
    </Modal>
  )
})
