import React, { useState, useEffect } from "react";
import { message } from "antd";
import styles from "./register.module.css";
import { http } from "libs";
import { Link } from "react-router-dom";

export default function () {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {}, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!username || !password || !code) {
      message.error("username 、 password or code can not be empty !");
      return;
    }
    setLoading(true);

    http
      .post("/api/v1/register", { username, password, code, uuid: email })
      .then(function (response) {
        message.success("register success, to login ...");
        window.location.href = `${window.location.origin}`;
      })
      .catch(function (error) {
        message.error("login failed, please check the username and password !");
      })
      .finally(function () {
        setLoading(false);
      });
  }

  function getCode(e) {
    e.preventDefault();
    if (!email) {
      message.error("email can not be empty !");
      return;
    }

    http
      .get(`/api/v1/captchaEmail?email=${email}`)
      .then(function (response) {
        // handle success
        const uuid = response?.data?.uuid;
        localStorage.setItem("uuid", uuid);
        message.success("code send success! please check your email");
      })
      .catch(function (error) {
        message.error("error");
      })
      .finally(function () {
        // always executed
      });
  }

  return (
    <div className={styles.loginbody} loading={loading}>
      <div className={styles.container}>
        <h1>User Registration</h1>
        <form id="registerForm">
          <input
            type="text"
            placeholder="Username"
            name="username"
            required
            onInput={(e) => setUsername(e.target.value)}
          />
          <br />
          <input
            type="text"
            placeholder="Email or Phone Number"
            name="email"
            required
            onInput={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            type="text"
            placeholder="Set your password"
            name="password"
            required
            onInput={(e) => setPassword(e.target.value)}
          />
          <br />

          <div className={styles.code100}>
            <div className={styles.gencode}>
              <input
                type="text"
                placeholder="Verification Code"
                name="code"
                onInput={(e) => setCode(e.target.value)}
                style={{
                  width: "47%",
                  margin: "0.6rem 0",
                }}
              />
              <button
                style={{
                  width: "47%",
                  margin: "0.6rem 0",
                }}
                onClick={getCode}
              >
                Get Code
              </button>
            </div>
          </div>

          <br />
          <button onClick={handleSubmit}>Register</button>
        </form>
        <p style={{ color: "#aaa" }}>
          Already have an account?
          <Link to="/" style={{ marginLeft: "0.3rem" }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}