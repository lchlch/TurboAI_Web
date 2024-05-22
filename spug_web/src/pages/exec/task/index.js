import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import {
  // PlusOutlined,
  ThunderboltOutlined,
  // BulbOutlined,
  // QuestionCircleOutlined,
} from "@ant-design/icons";
import { Form, Button, Radio, message } from "antd";
import { ACEditor, AuthDiv, Breadcrumb } from "components";
import HostSelector from "pages/host/Selector";
import TemplateSelector from "./TemplateSelector";
import Parameter from "./Parameter";
import Output from "./Output";
import { http, cleanCommand } from "libs";
// import moment from "moment";
import store from "./store";
// import gStore from "gStore";
import style from "./index.module.less";

import hljs from "../../../highlight";
import "highlight.js/styles/a11y-dark.css";

function TaskIndex() {
  const [loading, setLoading] = useState(false);
  const [interpreter, setInterpreter] = useState("sh");
  const [command, setCommand] = useState("");
  // const [template_id, setTemplateId] = useState();
  // const [histories, setHistories] = useState([]);
  const [parameters, setParameters] = useState([]);
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState([]);

  useEffect(() => {
    if (!loading) {
      // http.get('/api/exec/do/')
      //   .then(res => setHistories([]))
    }
  }, [loading]);

  const logRef = React.useRef(null);
  useEffect(() => {
    if (logRef.current) {
      hljs.highlightBlock(logRef.current);
    }
  }, []);

  useEffect(() => {
    if (!command) {
      setParameters([]);
    }
  }, [command]);

  useEffect(() => {
    // gStore.fetchUserSettings()
    // return () => {
    //   store.host_ids = []
    //   if (store.showConsole) {
    //     store.switchConsole()
    //   }
    // }
  }, []);

  function handleSubmit(params) {
    if (!params && parameters.length > 0) {
      return setVisible(true);
    }
    setLoading(true);
    const formData = {
      ids: store.host_ids.join(","),
      command: cleanCommand(command),
    };
    if(!formData.ids) {
      message.error("please select hosts")
      return
    }
    if(!formData.command) {
      message.error("command can not be empty")
      return 
    }
    http
      .get("/api/v1/server/bash/trans", { params: formData })
      .then((res) => {
        // message.success(res.output, 5);
        // showModal()
        console.log(res?.output?.split(/\r?\n/));
        debugger;
        setValue(res?.output?.split(/\r?\n/));
      })
      .finally(() => setLoading(false));
  }

  function handleTemplate(tpl) {
    if (tpl.host_ids.length > 0) store.host_ids = tpl.host_ids;
    // setTemplateId(tpl.id);
    setInterpreter(tpl.interpreter);
    setCommand(tpl.body);
    setParameters(tpl.parameters);
  }

  // function handleClick(item) {
  //   setTemplateId(item.template_id);
  //   setInterpreter(item.interpreter);
  //   setCommand(item.command);
  //   setParameters(item.parameters || []);
  //   store.host_ids = item.host_ids;
  // }

  return (
    <AuthDiv auth="run">
      {/* <Modal
            title="Basic Modal"
            visible={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <p>{value}</p>
          </Modal> */}
      <Breadcrumb>
        <Breadcrumb.Item>homepage</Breadcrumb.Item>
        <Breadcrumb.Item>batch execution</Breadcrumb.Item>
        <Breadcrumb.Item>execute tasks</Breadcrumb.Item>
      </Breadcrumb>
      <div className={style.index} hidden={store.showConsole}>
        <Form layout="vertical" className={style.left}>
          <Form.Item required label="Target hosts">
            <HostSelector
              type="button"
              value={store.host_ids}
              onChange={(ids) => (store.host_ids = ids)}
            />
          </Form.Item>

          <Form.Item required label="shell command" style={{ position: "relative" }}>
            <Radio.Group
              buttonStyle="solid"
              style={{ marginBottom: 12 }}
              value={interpreter}
              onChange={(e) => setInterpreter(e.target.value)}
            >
              <Radio.Button
                value="sh"
                style={{ width: 80, textAlign: "center" }}
              >
                Shell
              </Radio.Button>
              {/* <Radio.Button value="python" style={{width: 80, textAlign: 'center'}}>Python</Radio.Button> */}
            </Radio.Group>
            {/* <a href="https://TurboAI.cc/docs/batch-exec" target="_blank" rel="noopener noreferrer"
               className={style.tips}><BulbOutlined/> 使用全局变量？</a> */}
            {/* <Button style={{float: 'right'}} icon={<PlusOutlined/>} onClick={store.switchTemplate}>从执行模版中选择</Button> */}
            <ACEditor
              className={style.editor}
              mode={interpreter}
              value={command}
              width="100%"
              onChange={setCommand}
            />
          </Form.Item>
          <Button
            loading={loading}
            icon={<ThunderboltOutlined />}
            type="primary"
            onClick={() => handleSubmit()}
          >
            start
          </Button>
        </Form>

        <div className={style.right}>
          <div className={style.title}>
            results
            {/* <Tooltip title="多次相同的执行记录将会合并展示，每天自动清理，保留最近30条记录。">
              <QuestionCircleOutlined
                style={{ color: "#999", marginLeft: 8 }}
              />
            </Tooltip> */}
          </div>
          <pre>
            <code id={"javascript"} ref={logRef} style={{ height: "620px" }}>
              {value.map((item, index) => (
                <p>{item}</p>
              ))}
            </code>
          </pre>
          {/* <div className={style.inner}>
            {value.map((item, index) => (
              <p>{item}</p>
            ))}
          </div> */}
        </div>
      </div>
      {store.showTemplate && (
        <TemplateSelector
          onCancel={store.switchTemplate}
          onOk={handleTemplate}
        />
      )}
      {store.showConsole && <Output onBack={store.switchConsole} />}
      {visible && (
        <Parameter
          parameters={parameters}
          onCancel={() => setVisible(false)}
          onOk={(v) => handleSubmit(v)}
        />
      )}
    </AuthDiv>
  );
}

export default observer(TaskIndex);
