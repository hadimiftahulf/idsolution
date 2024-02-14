import CustomDiv from "@/components/html/CustomDiv";
import ModalAddEditEmployee from "@/components/modal/ModalAddEditEmployee";
import Pagination from "@/components/pagination/Pagination";
import { handleAccess } from "@/middlewares/accessMiddleware";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React, { HTMLAttributes, useEffect } from "react";
import UIkit from "uikit";

interface CustomModalProps extends HTMLAttributes<HTMLDivElement> {
  container: string;
}

function Employee() {
  const [dataUser, setUser] = React.useState({
    users: [],
    total: 0,
  });
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [data, setData] = React.useState({
    type: "",
    data: null,
  });

  const handleUser = async () => {
    try {
      // console.log(session);
      const params: any = {
        page: page,
        pageSize: 5,
      };
      if (search !== "") {
        params.search = search;
      }
      const res: any = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/users`,
        {
          params: params,
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        }
      );
      // console.log(res);
      setUser(res.data);
    } catch (error: any) {
      if (error.response.status === 401) {
        signOut();
      }
    }
  };

  const { data: session } = useSession();
  // console.log(session);
  useEffect(() => {
    if (session !== undefined && dataUser.users.length === 0) {
      handleUser();
    }
  }, [session]);
  return (
    <div className="uk-container uk-container-large" id="parent-component">
      <div uk-grid="" className="uk-child-width-1-1@s uk-child-width-1-1@l">
        <div>
          <div className="uk-card uk-card-default">
            <div className="uk-flex uk-flex-between">
              <div className="uk-card-header">Employee</div>
              {session &&
                handleAccess(
                  session?.user?.role?.permission,
                  "Employee",
                  "c"
                ) && (
                  <button
                    className="uk-button  uk-button-primary"
                    onClick={() => {
                      setData({ type: "Add", data: null });
                      UIkit.modal("#employee-add").show();
                    }}
                  >
                    Create
                  </button>
                )}
            </div>
            <div className="uk-card-body">
              <div className="uk-flex uk-flex-center@m uk-flex-right@l">
                <form className="uk-search uk-search-default">
                  <span
                    className="uk-search-icon-flip"
                    uk-search-icon=""
                  ></span>
                  <input
                    className="uk-search-input"
                    type="search"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyUp={(e) => {
                      setPage(1);
                      handleUser();
                    }}
                    aria-label="Search"
                  />
                </form>
              </div>
              <table className="uk-table uk-table-hover uk-table-middle uk-table-divider">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dataUser?.users.length > 0 &&
                    dataUser.users.map((user: any, key: any) => (
                      <tr key={key}>
                        <td>
                          <Image
                            className="uk-preserve-width uk-border-circle"
                            src={user.employee.photo}
                            width="40"
                            height="40"
                            alt=""
                          />
                        </td>
                        <td>{user.employee.name}</td>
                        <td>{user.role.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>
                          <div className="uk-flex uk-flex-center">
                            {session &&
                              !handleAccess(
                                session?.user?.role?.permission,
                                "Employee",
                                "u"
                              ) &&
                              user.id === session?.user?.id && (
                                <a
                                  className="uk-button uk-button-default uk-button-small uk-margin-small-right"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setData({ type: "Edit", data: user });
                                    UIkit.modal("#employee-add").show();
                                  }}
                                >
                                  Edit
                                </a>
                              )}
                            {session &&
                              handleAccess(
                                session?.user?.role?.permission,
                                "Employee",
                                "u"
                              ) && (
                                <a
                                  className="uk-button uk-button-default uk-button-small uk-margin-small-right"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setData({ type: "Edit", data: user });
                                    UIkit.modal("#employee-add").show();
                                  }}
                                >
                                  Edit
                                </a>
                              )}
                            {session &&
                              handleAccess(
                                session?.user?.role?.permission,
                                "Employee",
                                "d"
                              ) && (
                                <a
                                  className="uk-button uk-button-danger uk-button-small"
                                  onClick={(e) => {
                                    UIkit.modal
                                      .confirm(
                                        `Apa Anda Yakin ingin menghapus data ${user.employee.name}?`
                                      )
                                      .then(
                                        async function () {
                                          try {
                                            const res = await axios.delete(
                                              `${process.env.NEXT_PUBLIC_URL}/api/users?id=${user.id}`,
                                              {
                                                headers: {
                                                  Authorization: `Bearer ${session?.user?.accessToken}`,
                                                },
                                              }
                                            );
                                            UIkit.notification(
                                              "Data Berhasil di Hapus",
                                              {
                                                status: "primary",
                                              }
                                            );
                                            handleUser();
                                          } catch (error: any) {
                                            if (error.response.status === 401) {
                                              signOut();
                                            }
                                          }
                                        },
                                        function () {
                                          console.log("Rejected.");
                                        }
                                      );
                                  }}
                                >
                                  Delete
                                </a>
                              )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <Pagination
                totalPages={Math.ceil(dataUser.total / 5)}
                currentPage={page}
                onPageChange={setPage}
                loadQuery={handleUser}
              />
            </div>
          </div>
        </div>
      </div>
      <ModalAddEditEmployee
        target="employee-add"
        title={data.type}
        data={data.data}
        loadData={handleUser}
      />
    </div>
  );
}

export default Employee;
