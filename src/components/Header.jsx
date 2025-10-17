"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

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
  }, [pathname]);

  const handleLogout = (e) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.removeItem("user_token");
      localStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
      logout();
      router.push("/auth/login");
    }
  };

  return (
    <header className="header header-custom header-fixed inner-header relative">
      <div className="container">
        <nav className="navbar navbar-expand-lg header-nav">
          {/* ✅ Giữ nguyên phần desktop */}
          <div className="navbar-header">
            <a id="mobile_btn" href="#menu">
              <span className="bar-icon">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </a>

            {/* ✅ Logo desktop */}
            <Link
              href="/"
              className="menu-logo d-none d-lg-flex"
              style={{ display: "flex", alignItems: "center" }}
            >
              <img
                src="/theme/assets/img/logo-2.jpg"
                className="img-fluid"
                alt="Logo"
                style={{ height: "50px", width: "auto", marginRight: "10px" }}
              />
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  color: "black",
                }}
              >
                BOOKSNAP
              </span>
            </Link>

            {/* ✅ Logo mobile ở giữa */}
            <Link
              href="/"
              className="menu-logo d-lg-none mobile-center-logo"
            >
              <img
                src="/theme/assets/img/logo-2.jpg"
                alt="Logo"
                style={{ height: "45px", width: "auto", marginRight: "8px" }}
              />
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  color: "black",
                }}
              >
                BOOKSNAP
              </span>
            </Link>
          </div>

          {/* ✅ Giữ nguyên toàn bộ desktop header-menu */}
          <div className="header-menu">
            <div className="main-menu-wrapper">
              <div className="menu-header">
                {/* Logo hiển thị khi menu mở trên mobile */}
                <Link
                  href="/"
                  className="menu-logo d-lg-none"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <img
                    src="/theme/assets/img/logo-2.jpg"
                    className="img-fluid"
                    alt="Logo"
                    style={{ height: "45px", width: "auto", marginRight: "8px" }}
                  />
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "18px",
                      color: "black",
                    }}
                  >
                    BOOKSNAP
                  </span>
                </Link>
                <a id="menu_close" className="menu-close" href="#menu">
                  <i className="fas fa-times"></i>
                </a>
              </div>

              <ul className="main-nav">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/search">Photographers</Link></li>
                <li><Link href="/gallery">Portfolios</Link></li>
                <li><Link href="/">Contact Us</Link></li>

                {/* ✅ Menu mobile riêng */}
                {!isLoading && (
                  <>
                    {!isAuthenticated ? (
                      <>
                        <li className="d-lg-none"><Link href="/auth/login">Sign In</Link></li>
                        <li className="d-lg-none"><Link href="/auth/register">Register</Link></li>
                      </>
                    ) : (
                      <>
                        <li className="d-lg-none"><Link href="/appointment">My Appointments</Link></li>
                        <li className="d-lg-none"><a href="#" onClick={handleLogout}>Sign Out</a></li>
                      </>
                    )}
                  </>
                )}
              </ul>
            </div>

            {/* ✅ Giữ nguyên phần phải (desktop) */}
            <ul className="nav header-navbar-rht">
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
                        href="#"
                        onClick={handleLogout}
                      >
                        <i className="isax isax-user me-1"></i>Sign Out
                      </a>
                    </div>
                  </li>
                )}
              </div>
            </ul>
          </div>
        </nav>
      </div>

      <style jsx>{`
  /* ✅ Giữ nguyên layout desktop */
  @media (min-width: 992px) {
    .mobile-center-logo {
      position: static !important;
      transform: none !important;
    }
  }

  /* ✅ Căn giữa logo trên mobile */
  @media (max-width: 991px) {
    .navbar-header {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #mobile_btn {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 10;
    }

    .mobile-center-logo {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .mobile-center-logo img {
      height: 45px;
      width: auto;
    }
  }
`}</style>

    </header>
  );
}
