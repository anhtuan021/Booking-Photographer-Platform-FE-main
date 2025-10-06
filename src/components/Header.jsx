"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { usePathname } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = () => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      setUser(userData ? JSON.parse(userData) : null);
      setIsAuthenticated(!!localStorage.getItem("user_token"));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [pathname]); // gọi lại khi route thay đổi

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const userData = localStorage.getItem("user");
  //     setUser(userData ? JSON.parse(userData) : null);
  //     setIsAuthenticated(!!localStorage.getItem("user_token"));
  //   }
  // }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.removeItem("user_token");
      localStorage.removeItem("user");
      // localStorage.removeItem("myBookings");
      setUser(null); // cập nhật state user
      setIsAuthenticated(false); // cập nhật state xác thực
      logout();
      router.push("/auth/login");
    }
  };

  return (
    <>
      <header className="header header-custom header-fixed inner-header relative">
        <div className="container">
          <nav className="navbar navbar-expand-lg header-nav">
            <div className="navbar-header">
              <a id="mobile_btn" href="/">
                <span className="bar-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </a>
              <Link href="/" className="navbar-brand logo">
                <img
                  src="/theme/assets/img/logo-1.png"
                  className="img-fluid"
                  alt="Logo"
                />
              </Link>
            </div>
            <div className="header-menu">
              <div className="main-menu-wrapper">
                <div className="menu-header">
                  <Link href="/" className="menu-logo">
                    <img
                      src="/theme/assets/img/logo-1.png"
                      className="img-fluid"
                      alt="Logo"
                    />
                  </Link>
                  <a id="menu_close" className="menu-close" href="#menu">
                    <i className="fas fa-times"></i>
                  </a>
                </div>
                <ul className="main-nav">
                  <li className="has-submenu megamenu ">
                    <a href="/">Home</a>
                  </li>
                  <li className="has-submenu">
                    <a href="/search">Photographers</a>
                  </li>
                  <li className="has-submenu">
                    <a href="/gallery">Portfolios</a>
                  </li>
                  {/* 
                  <li className="has-submenu">
                    <a href="/appointment">My Appointments</a>
                  </li> */}
                  <li className="has-submenu">
                    <a href="/">Contact Us</a>
                  </li>
                </ul>
              </div>
              <ul className="nav header-navbar-rht">
                {/* <li className="searchbar">
                  <a href="./">
                    <i className="feather-search"></i>
                  </a>
                </li> */}
                <div
                  className="header-user-area"
                  style={{ minWidth: 200, textAlign: "right" }}
                >
                  {isLoading ? null : !isAuthenticated ? (
                    <>
                      <li>
                        <Link
                          href="/auth/login"
                          className="btn btn-primary-gradient d-inline-flex align-items-center rounded-pill"
                          style={{ backgroundImage: "none" }}
                        >
                          <i className="isax isax-lock-1 me-1"></i>Sign In
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/auth/register"
                          className="btn btn-primary-gradient d-inline-flex align-items-center rounded-pill"
                          style={{ backgroundImage: "none" }}
                        >
                          <i className="isax isax-user-tick me-1"></i>Register
                        </Link>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="nav-item dropdown has-arrow logged-item">
                        <a
                          href="#"
                          className="dropdown-toggle nav-link"
                          data-bs-toggle="dropdown"
                        >
                          <span className="user-img">
                            {user && user.firstName + " " + user.lastName}
                          </span>
                        </a>
                        <div className="dropdown-menu dropdown-menu-end">
                          <a
                            className="dropdown-item btn-md btn-primary-gradient"
                            href="/appointment"
                          >
                            <i className="fa fa-list-ol" aria-hidden="true"></i>
                            &ensp; My Appointments
                          </a>
                          <a
                            className="dropdown-item btn-md btn-primary-gradient"
                            href="/profile"
                            onClick={handleLogout}
                          >
                            <i className="isax isax-user me-1"></i>Sign Out
                          </a>
                        </div>
                      </li>
                      {/* <li>
                      <a
                        href="#"
                        className="btn btn-md btn-primary-gradient d-inline-flex align-items-center rounded-pill"
                        onClick={handleLogout}
                      >
                        <i className="isax isax-user me-1"></i>Sign Out
                      </a>
                    </li> */}
                    </>
                  )}
                </div>
              </ul>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
