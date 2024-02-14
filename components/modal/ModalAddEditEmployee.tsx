import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import UIkit from "uikit";
import CustomDiv from "../html/CustomDiv";

function ModalAddEditEmployee({
  target,
  title,
  data,
  loadData,
}: {
  target: string;
  title: string;
  data: any;
  loadData: () => void;
}) {
  const defaultPhoto = "/avatar.png";
  const [avatar, setAvatar] = useState(defaultPhoto);
  const { data: session, update } = useSession();

  const [inputEmployee, setInput] = useState<any>({
    name: "",
    email: "",
    password: "",
    phone: "",
    roleId: "",
  });
  const [roles, setRoles] = useState<any>([]);

  useEffect(() => {
    UIkit.upload(".js-upload", {
      url: `${process.env.NEXT_PUBLIC_URL}/api/upload`,
      multiple: false,

      name: "file",
      load: function () {
        console.log("load", arguments);
      },
      error: function () {
        console.log("error", arguments);
      },
      complete: async function (e: any) {
        const response = JSON.parse(e.response);
        // console.log(response);
        try {
          const deleteFoto = await axios.delete(
            `${process.env.NEXT_PUBLIC_URL}/api/upload?filename=${
              avatar.split("/")[avatar.split("/").length - 1]
            }`
          );
          // console.log(deleteFoto);
        } catch (error) {
          console.log(error);
        }

        setAvatar(response.path);
      },
    });
  }, []);
  useEffect(() => {
    const handleRole = async () => {
      try {
        // console.log(session);
        const res: any = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/role`,
          {
            headers: {
              Authorization: `Bearer ${session?.user?.accessToken}`,
            },
          }
        );
        setRoles(res.data.role);
      } catch (error: any) {
        if (error.response.status === 401) {
          signOut();
        }
      }
    };
    if (session !== undefined && roles.length === 0) {
      handleRole();
    }
  }, [session]);

  useEffect(() => {
    setInput({
      name: "",
      email: "",
      password: "",
      phone: "",
      roleId: "",
    });
    setAvatar(defaultPhoto);
    if (title === "Edit") {
      setInput({
        name: data.employee.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        roleId: data.roleId,
      });
      setAvatar(data.employee.photo);
    }
  }, [data]);

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({
      ...inputEmployee,
      [e.target.name]: e.target.value,
    });
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      inputEmployee.photo = avatar;
      let reqApi = axios.post;
      if (title === "Edit") {
        reqApi = axios.put;
        inputEmployee.id = data.employee.id;
      }

      const res = await reqApi(
        `${process.env.NEXT_PUBLIC_URL}/api/users`,
        inputEmployee,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        }
      );
      if (res.status === 200) {
        if (title === "Edit" && session?.user?.id === data.employee.id) {
          update({
            ...session?.user,
            ...res?.data.user,
          });
        }
        UIkit.notification(title === "Edit" ? "Edit Success" : "Add Success", {
          status: "success",
        });
        UIkit.modal(`#${target}`).hide();
        loadData();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <CustomDiv id={target} uk-modal="" container="#main">
      <div className="uk-modal-dialog">
        <form
          className="uk-form-stacked"
          encType="multipart/form-data"
          onSubmit={onSave}
        >
          <button
            className="uk-modal-close-default"
            type="button"
            uk-close=""
          ></button>
          <div className="uk-modal-header">
            <h2 className="uk-modal-title">{title}</h2>
          </div>
          <div className="uk-modal-body">
            <center>
              <div className="js-upload uk-placeholder uk-text-center">
                <div uk-form-custom="">
                  <input type="file" name="file" />
                  <span className="uk-link">
                    <Image
                      src={avatar}
                      id="avatar"
                      width="100"
                      height="100"
                      className="uk-border-circle"
                      alt="Avatar"
                    />
                  </span>
                </div>
              </div>
            </center>
            <div className="uk-margin">
              <label>Email</label>
              <div className="uk-inline uk-width-1-1">
                <span className="uk-form-icon" uk-icon="icon: mail"></span>
                <input
                  className="uk-input"
                  name={"email"}
                  value={inputEmployee.email}
                  onChange={handleChangeValue}
                  placeholder="email"
                  type="text"
                  aria-label="Not clickable icon"
                />
              </div>
            </div>

            <div className="uk-margin">
              <label>Name</label>
              <div className="uk-inline uk-width-1-1">
                <span className="uk-form-icon" uk-icon="icon: user"></span>
                <input
                  className="uk-input"
                  type="name"
                  name={"name"}
                  value={inputEmployee.name}
                  onChange={handleChangeValue}
                  placeholder="name"
                  aria-label="Not clickable icon"
                />
              </div>
            </div>
            <div className="uk-margin">
              <label>Phone</label>
              <div className="uk-inline uk-width-1-1">
                <span className="uk-form-icon" uk-icon="icon: phone"></span>
                <input
                  className="uk-input"
                  placeholder="phone number"
                  name={"phone"}
                  value={inputEmployee.phone}
                  onChange={handleChangeValue}
                  type="phone"
                  aria-label="Not clickable icon"
                />
              </div>
            </div>
            <div className="uk-margin">
              <label>Password</label>
              <div className="uk-inline uk-width-1-1">
                <span className="uk-form-icon" uk-icon="icon: lock"></span>
                <input
                  className="uk-input"
                  name={"password"}
                  value={inputEmployee.password}
                  onChange={handleChangeValue}
                  placeholder="password"
                  type="password"
                  aria-label="Not clickable icon"
                />
              </div>
            </div>
            <div className="uk-margin">
              <label>Role</label>
              <div className="uk-inline uk-width-1-1">
                <select
                  className="uk-select"
                  id="form-horizontal-select"
                  name="roleId"
                  value={inputEmployee.roleId}
                  onChange={(e) => {
                    setInput({
                      ...inputEmployee,
                      roleId: e.target.value,
                    });
                  }}
                >
                  {roles.length > 0 &&
                    roles.map((role: any, key: any) => (
                      <option key={key} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
          <div className="uk-modal-footer uk-text-right">
            <button
              className="uk-button uk-button-default uk-modal-close"
              type="button"
            >
              Cancel
            </button>
            <button className="uk-button uk-button-primary" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </CustomDiv>
  );
}

export default ModalAddEditEmployee;
