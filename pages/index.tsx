// pages/index.js
import React, { ReactElement, useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "./_app";
import UIkit from "uikit";

const Home: NextPageWithLayout = () => {
  const router = useRouter();
  const [inputLogin, setInputLogin] = useState({
    username: "",
    password: "",
  });
  const [inputRegister, setInputRegister] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const { data: session } = useSession();
  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  });
  const [tab, setTab] = React.useState("login");
  const [error, setError] = React.useState("");
  const [forgot, setForgot] = React.useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("Form submitted!");
    if (tab === "register") {
      try {
        const res = await axios.post("/api/register", inputRegister);
        if (res.status === 200) {
          UIkit.notification("Register Success", { status: "success" });
          setTab("login");
        }
      } catch (error: any) {
        setError(error.response.data.error);
        setInterval(() => {
          setError("");
        }, 10000);
      }
    } else {
      if (forgot) {
        try {
          const res = await axios.post("/api/forgot-password", {
            email: inputLogin.username,
            newPassword: inputLogin.password,
          });
          if (res.status === 200) {
            UIkit.notification("Forgot Password Success", {
              status: "success",
            });
            setForgot(false);
          }
        } catch (error: any) {
          setError(error.response.data.error);
          setInterval(() => {
            setError("");
          }, 10000);
        }
      } else {
        const res = await signIn("credentials", {
          username: inputLogin.username,
          password: inputLogin.password,
          redirect: false,
        });
        if (res?.error) {
          setError("Username or password is incorrect");
          setInterval(() => {
            setError("");
          }, 10000);
        }
      }
    }
  };
  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (tab === "login") {
      setInputLogin({
        ...inputLogin,
        [e.target.name]: e.target.value,
      });
    } else {
      setInputRegister({
        ...inputRegister,
        [e.target.name]: e.target.value,
      });
    }
  };
  return (
    <div>
      <Head>
        <title>Next.js with UIkit</title>
      </Head>

      {/* <div className="uk-container"> */}
      <div className="uk-position-center uk-card uk-card uk-card-default uk-card-body ">
        <div>
          <ul className="uk-tab uk-flex-center" uk-tab="">
            <li className={tab === "login" ? "uk-active" : ""}>
              <a href="#" onClick={() => setTab("login")}>
                Login
              </a>
            </li>
            <li className={tab === "register" ? "uk-active" : ""}>
              <a href="#" onClick={() => setTab("register")}>
                Register
              </a>
            </li>
          </ul>
        </div>
        <form // className='uk-position-center'
          onSubmit={handleSubmit}
        >
          {error !== "" && (
            <p className="uk-alert-warning" uk-alert>
              {error}
            </p>
          )}
          {tab === "login" && (
            <>
              <div className="uk-margin">
                <div className="uk-inline uk-width-1-1">
                  <span className="uk-form-icon" uk-icon="icon: user"></span>
                  <input
                    className="uk-input"
                    name="username"
                    value={inputLogin.username}
                    onChange={handleChangeValue}
                    placeholder="email or phone number"
                    type="text"
                    aria-label="Not clickable icon"
                  />
                </div>
              </div>

              <div className="uk-margin">
                <div className="uk-inline uk-width-1-1">
                  <span className="uk-form-icon" uk-icon="icon: lock"></span>
                  <input
                    className="uk-input"
                    name="password"
                    placeholder={`input your ${
                      forgot ? "new Password" : "password"
                    }`}
                    type="password"
                    value={inputLogin.password}
                    onChange={handleChangeValue}
                    aria-label="Not clickable icon"
                  />
                </div>
              </div>
              <div className="uk-margin">
                <button
                  className={`uk-button uk-button-primary uk-width-1-1   ${
                    forgot && "uk-hidden"
                  }`}
                  type={"submit"}
                >
                  Login
                </button>
                <button
                  className={`uk-button ${
                    forgot
                      ? "uk-button-primary  uk-margin-small-bottom"
                      : "uk-button-default "
                  }uk-width-1-1`}
                  onClick={() => setForgot(true)}
                  type={forgot ? "submit" : "button"}
                >
                  Forgot Password
                </button>
                {forgot && (
                  <button
                    className={`uk-button uk-button-default uk-width-1-1 margin-top uk-margin-small-bottom`}
                    onClick={() => setForgot(false)}
                  >
                    Back to Login
                  </button>
                )}
              </div>
            </>
          )}
          {tab === "register" && (
            <>
              <div className="uk-margin">
                <div className="uk-inline uk-width-1-1">
                  <span className="uk-form-icon" uk-icon="icon: mail"></span>
                  <input
                    className="uk-input"
                    name={"email"}
                    value={inputRegister.email}
                    onChange={handleChangeValue}
                    placeholder="email"
                    type="text"
                    aria-label="Not clickable icon"
                  />
                </div>
              </div>

              <div className="uk-margin">
                <div className="uk-inline uk-width-1-1">
                  <span className="uk-form-icon" uk-icon="icon: user"></span>
                  <input
                    className="uk-input"
                    type="name"
                    name={"name"}
                    value={inputRegister.name}
                    onChange={handleChangeValue}
                    placeholder="name"
                    aria-label="Not clickable icon"
                  />
                </div>
              </div>
              <div className="uk-margin">
                <div className="uk-inline uk-width-1-1">
                  <span className="uk-form-icon" uk-icon="icon: phone"></span>
                  <input
                    className="uk-input"
                    placeholder="phone number"
                    name={"phone"}
                    value={inputRegister.phone}
                    onChange={handleChangeValue}
                    type="phone"
                    aria-label="Not clickable icon"
                  />
                </div>
              </div>
              <div className="uk-margin">
                <div className="uk-inline uk-width-1-1">
                  <span className="uk-form-icon" uk-icon="icon: lock"></span>
                  <input
                    className="uk-input"
                    name={"password"}
                    value={inputRegister.password}
                    onChange={handleChangeValue}
                    placeholder="password"
                    type="password"
                    aria-label="Not clickable icon"
                  />
                </div>
              </div>
              <div className="uk-margin">
                <button
                  className="uk-button uk-button-primary uk-width-1-1  uk-margin-small-bottom"
                  type="submit"
                >
                  Register
                </button>
              </div>
            </>
          )}

          {/* Tambahkan tombol submit atau elemen formulir lainnya di sini */}
        </form>
      </div>
    </div>
    // </div>
  );
};

export default Home;
Home.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};
