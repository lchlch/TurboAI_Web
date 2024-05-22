import http from "axios";
import history from "./history";
// import { X_TOKEN } from "./functools";
import { message } from "antd";
import JsonBigint from "json-bigint";

// response处理
function handleResponse(response) {
  let result = null;
  if (response.status === 401) {
    result = "会话过期，请重新登录";
    if (history.location.pathname !== "/") {
      history.push("/", { from: history.location });
    } else {
      return Promise.reject();
    }
  } else if (response.status === 200) {
    // if attachment
    if (
      response.headers["content-type"] ===
      "application/octet-stream;charset=UTF-8"
    ) {
      return Promise.resolve(response.data);
    }
    if (response.data.code === 0 || response.data.status === "success") {
      return Promise.resolve(response.data.data);
    } else {
      message.error(response.data.msg);
      return Promise.reject(response.data.msg);
    }
  } else {
    result = `${response.status} ${response.statusText}`;
  }

  //   if (response.data.error) {
  //     result = response.data.error;
  //   } else if (response.data.data) {
  //     return Promise.resolve(response.data.data);
  //   } else if (
  //     response.headers["content-type"] === "application/octet-stream"
  //   ) {
  //     return Promise.resolve(response);
  //   } else if (!response.config.isInternal) {
  //     return Promise.resolve(response.data);
  //   } else {
  //     result = "无效的数据格式";
  //   }
  // } else {
  //   result = `请求失败: ${response.status} ${response.statusText}`;
  // }
  message.error(result);
  return Promise.reject(result);
}

// 请求拦截器
http.interceptors.request.use((request) => {
  request.isInternal = request.url.startsWith("/api/");
  let token = localStorage.getItem("token");
  // if (request.isInternal) {
  //   request.headers[""] = token;
  // }
  request.headers["token"] = token;
  request.headers["Authorization"] = `Bearer ${token}`;
  request.timeout = request.timeout || 30000;
  return request;
});

// 返回拦截器
http.interceptors.response.use(
  (response) => {
    return handleResponse(response);
  },
  (error) => {
    if (error.response) {
      return handleResponse(error.response);
    }
    const result = "请求异常: " + error.message;
    message.error(result);
    return Promise.reject(result);
  }
);

http.defaults.transformResponse = [
  function (data) {
    try {
      return JsonBigint.parse(data);
    } catch {
      return data;
    }
  },
];

export default http;
