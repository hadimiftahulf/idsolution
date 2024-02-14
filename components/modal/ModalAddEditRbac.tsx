import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import UIkit from "uikit";
import CustomDiv from "../html/CustomDiv";

function ModalAddEditRbac({
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
  // console.log(data);
  const { data: session, update } = useSession();

  const [inputRbac, setInput] = useState<any>({
    name: "",
    description: "",
    permission: [],
  });
  const [modul, setModul] = useState<any>([]);

  useEffect(() => {
    const handleModul = async () => {
      try {
        // console.log(session);
        const res: any = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/modul`,
          {
            headers: {
              Authorization: `Bearer ${session?.user?.accessToken}`,
            },
          }
        );
        setModul(res.data.modul);
      } catch (error: any) {
        if (error.response.status === 401) {
          signOut();
        }
      }
    };
    if (session !== undefined && modul.length === 0) {
      handleModul();
    }
  }, [session]);

  useEffect(() => {
    setInput({
      name: "",
      description: "",
      permission: [],
    });
    if (title === "Edit") {
      data.permission.map((item: any) => {
        item.access = item.access.split(",");
      });
      setInput({
        name: data.name,
        description: data.description,
        permission: data.permission,
      });
    }
  }, [data]);

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({
      ...inputRbac,
      [e.target.name]: e.target.value,
    });
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let reqApi = axios.post;
      if (title === "Edit") {
        reqApi = axios.put;
        inputRbac.id = data.id;
      }

      inputRbac.permission = inputRbac.permission.map((item: any) => {
        return {
          modulId: item.modulId,
          access: item.access.toString(),
        };
      });

      const res = await reqApi(
        `${process.env.NEXT_PUBLIC_URL}/api/rbac`,
        inputRbac,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        }
      );
      if (res.status === 200) {
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

  const handleAccess = (value: string, checked: boolean, modulId: string) => {
    const checkAvail = inputRbac.permission.filter(
      (item: any) => Number(item.modulId) === Number(modulId)
    );
    let dataPermission = inputRbac.permission;
    let access = checkAvail[0]?.access || [];
    if (checkAvail.length === 0 && checked) {
      access.push(value);
      dataPermission.push({
        modulId: Number(modulId),
        access: access,
      });
    } else if (checkAvail.length > 0 && checked) {
      access.push(value);
      checkAvail[0].access = access;
    } else if (checkAvail.length > 0 && !checked) {
      const index = access.indexOf(value);
      access.splice(index, 1);
      checkAvail[0].access = access;
    }
    setInput({
      ...inputRbac,
      permission: dataPermission,
    });
  };

  const handleModulid = (value: string, checked: boolean) => {
    const checkAvail = inputRbac.permission.find(
      (item: any) => item.modulId === value
    );
    let dataPermission = inputRbac.permission;
    if (!checkAvail && checked) {
      dataPermission.push({
        modulId: Number(value),
        access: [],
      });
    } else {
      const index = dataPermission.findIndex(
        (item: any) => item.modulId === value
      );
      dataPermission.splice(index, 1);
    }
    setInput({
      ...inputRbac,
      permission: dataPermission,
    });
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
            <div className="uk-margin">
              <label>Name</label>
              <div className="uk-inline uk-width-1-1">
                <span className="uk-form-icon" uk-icon="icon: bookmark"></span>
                <input
                  className="uk-input"
                  name={"name"}
                  value={inputRbac.name}
                  onChange={handleChangeValue}
                  placeholder="name"
                  type="text"
                  aria-label="Not clickable icon"
                />
              </div>
            </div>
            <div className="uk-margin">
              <label>Description</label>
              <div className="uk-inline uk-width-1-1">
                {/* <span ></span> */}
                <textarea
                  className="uk-textarea uk-form-large"
                  name={"description"}
                  value={inputRbac.description}
                  onChange={(e) => {
                    setInput({
                      ...inputRbac,
                      description: e.target.value,
                    });
                  }}
                  placeholder="description"
                  aria-label="Not clickable icon"
                />
              </div>
            </div>

            <table className="uk-table uk-table-hover uk-table-middle uk-table-divider">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Modul Name</th>
                  <th className="uk-flex uk-flex-center">Access</th>
                </tr>
              </thead>
              <tbody>
                {modul.length > 0 &&
                  modul.map((item: any, index: number) => {
                    let permissionx = inputRbac.permission.filter(
                      (items: any) => Number(items.modulId) === Number(item.id)
                    );
                    return (
                      <tr key={index}>
                        <td>
                          <div>
                            <label>
                              <input
                                className="uk-checkbox"
                                checked={permissionx.length > 0}
                                type="checkbox"
                                value={item.id}
                                onClick={(e: any) => {
                                  handleModulid(
                                    e.target.value,
                                    e.target.checked
                                  );
                                }}
                              />
                            </label>
                          </div>
                        </td>
                        <td>{item.name}</td>
                        <td>
                          <div className="uk-flex uk-flex-center">
                            {item.feature.split(",").map((access: string) => {
                              return (
                                <div key={access}>
                                  <label>
                                    <input
                                      className="uk-checkbox"
                                      type="checkbox"
                                      value={access}
                                      checked={permissionx[0]?.access.includes(
                                        access
                                      )}
                                      onClick={(e: any) => {
                                        handleAccess(
                                          access,
                                          e.target.checked,
                                          item.id
                                        );
                                      }}
                                    />{" "}
                                    {access}
                                  </label>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
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

export default ModalAddEditRbac;
