import React, { useState, useEffect } from "react";
import { message } from "antd";
import styles from "./login.module.css";
import { http } from "libs";
import { Link } from "react-router-dom";

export default function () {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {}, []);

  // const fetchMenusByRoleId = () => {
  //   setLoading(true);
  //   return http
  //     .get("/api/v1/system/user/getInfo")
  //     .then((res) => {
  //       const { user } = res;
  //       const roleId = user?.roleId;
  //       if (roleId) {
  //         return http
  //           .get(`/api/v1/system/menu/roleMenuTreeselect/${roleId}`)
  //           .then((res) => {
  //             console.log(res);
  //           })
  //           .catch((e) => {
  //             // message.error("get role menus error", e);
  //             console.error(e);
  //           });
  //       }
  //     })
  //     .finally(() => setLoading(false));
  // };

  function handleSubmit(e) {
    e.preventDefault();
    if (!username || !password) {
      message.error("username and password can not be empty !");
      return;
    }
    setLoading(true);

    http
      .post("/api/v1/login", { username, password })
      .then(function (response) {
        // handle success
        localStorage.setItem("username", username);
        localStorage.setItem("token", response.token);
        localStorage.setItem("id", "id");
        localStorage.setItem("nickname", username);
        localStorage.setItem("is_supper", true);
        localStorage.setItem("login_type", "default");
        http
          .get("/api/v1/system/user/getInfo", { username, password })
          .then(function (res) {
            message.success("login success!");
            localStorage.setItem("userinfos", JSON.stringify(res));
            localStorage.setItem("permissions", JSON.stringify(res.permissions));
            localStorage.setItem("roleId", res?.user?.roleId);
            localStorage.setItem("userId", res?.user?.userId);
            // fetchMenusByRoleId().then(() => {

            window.location.href = `${window.location.origin}/dashboard`;
            // });
          })
          .catch(function (error) {
            message.error("get user info error", error);
          });
        // window.location.href = `${window.location.origin}/hostselection`;
      })
      .catch(function (error) {
        message.error(
          "login failed, please check the username and password !",
          error
        );
      })
      .finally(function () {
        setLoading(false);
      });
  }

  return (
    <div className={styles.loginbody}>
      <div className={styles.container}>
        <h1>User Login</h1>
        <form id="loginForm">
          <input
            type="text"
            placeholder="Username"
            name="username"
            required
            onInput={(e) => setUsername(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            name="password"
            required
            onInput={(e) => setPassword(e.target.value)}
          />
          <br />
          <button onClick={handleSubmit} loading={loading}>Login</button>
        </form>
        <p style={{ color: "#aaa" }}>
          Don't have an account?
          {/* <a href="register.html" style={{ color: "#007bff" }}>
            
          </a> */}
          <Link to="/register" style={{ marginLeft: "0.3rem" }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
