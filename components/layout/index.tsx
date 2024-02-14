// ("use client");
import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Script from "next/script";
import axios from "axios";
import Head from "next/head";

function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [menus, setMenu] = useState([]);
  const pathname = usePathname();
  const defaultPhoto = "/avatar.png";

  useEffect(() => {
    const handleMenu = async () => {
      try {
        const res: any = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/menus`,
          {
            headers: {
              Authorization: `Bearer ${session?.user?.accessToken}`,
            },
          }
        );
        setMenu(res.data.permission);
      } catch (error: any) {
        if (error.response.status === 401) {
          signOut();
        }
      }
    };
    if (session !== undefined) {
      handleMenu();
    }
  }, [session]);
  return (
    <>
      <Head>
        <title>ID SOLUTION - {pathname.replace("/", "").toUpperCase()}</title>
      </Head>
      <nav
        uk-sticky=""
        className="uk-navbar-container tm-navbar-container uk-active"
      >
        <div className="uk-container uk-container-expand">
          <nav uk-navbar="">
            <div className="uk-navbar-left">
              <a
                id="sidebar_toggle"
                className="uk-navbar-toggle"
                uk-navbar-toggle-icon=""
              ></a>
              <a href="#" className="uk-navbar-item uk-logo">
                ID SOLUTIONS
              </a>
            </div>
            <div className="uk-navbar-right uk-light">
              <ul className="uk-navbar-nav">
                <li className="uk-active">
                  <a href="#">
                    {session?.user?.employee?.name} &nbsp;
                    <span className="ion-ios-arrow-down"></span>
                  </a>
                  <div uk-dropdown="pos: bottom-right; mode: click; offset: -17;">
                    <ul className="uk-nav uk-navbar-dropdown-nav">
                      <li onClick={() => signOut()}>
                        <a href="#">Logout</a>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </nav>

      <div id="sidebar" className="tm-sidebar-left uk-background-default">
        <center>
          <div className="user">
            <Image
              src={session?.user?.employee?.photo || defaultPhoto}
              id="avatar"
              width="100"
              height="100"
              className="uk-border-circle"
              alt="Avatar"
            />
            <div className="uk-margin-top"></div>
            <div id="name" className="uk-text-truncate uk-text-capitalize">
              {session?.user?.employee?.name}
            </div>
            <div className="uk-text-truncate">{session?.user?.role?.name}</div>
            <span
              id="status"
              data-enabled="true"
              data-online-text="Online"
              data-away-text="Away"
              data-interval="10000"
              className="uk-margin-top uk-label uk-label-success"
            ></span>
          </div>
          <br />
        </center>
        <ul className="uk-nav uk-nav-default">
          <li className="uk-nav-header">Menu</li>
          {menus.length > 0 &&
            menus.map((menu: any, key: any) => (
              <li
                key={key}
                className={
                  pathname.replace("/", "").toLocaleLowerCase() ===
                  menu.modul.name.toLocaleLowerCase()
                    ? "uk-active"
                    : ""
                }
                onClick={() => {
                  router.push(`/${menu.modul.name.toLowerCase()}`);
                  // console.log(`/${menu.modul.name}`);
                }}
              >
                <a>{menu.modul.name}</a>
              </li>
            ))}
        </ul>
      </div>

      <div className="content-padder content-background">
        <div className="uk-section-small uk-section-default header">
          <div className="uk-container uk-container-large">
            <h1 className="uk-text-capitalize">
              <span className="ion-speedometer"></span>
              {pathname.replace("/", "")}
            </h1>
            <p className="uk-text-capitalize">
              Welcome back, {session?.user?.employee?.name}
            </p>
          </div>
        </div>
        <div className="uk-section-small">{children}</div>
      </div>

      {/* <Script src="/js/script.js"></Script> */}
    </>
  );
}

export default Layout;
