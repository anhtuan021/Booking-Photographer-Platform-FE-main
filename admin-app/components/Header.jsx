"use client";
import { useSelector, useDispatch } from "react-redux";
import { clearAuth } from "../store/authSlice";
import { useRouter } from "next/navigation";
export default function AdminHome() {
  let user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();
  if (!user && typeof window !== "undefined") {
    try {
      user = JSON.parse(localStorage.getItem("admin_user"));
    } catch {}
  }
  const role = user?.role || "";
  function handleLogout(e) {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
    }
    dispatch(clearAuth());
    router.push("/login");
  }

  return (
    <div className="header">
      <div className="header-left">
        <a href="/" className="logo">
          <img
            src="https://photographer-booking.vercel.app/theme/assets/img/logo-1.png"
            alt="Logo"
          />
        </a>
        <a href="/" className="logo logo-small">
          <img
            src="https://photographer-booking.vercel.app/theme/assets/img/logo-1.png"
            alt="Logo"
            width="30"
            height="30"
          />
        </a>
      </div>

      <a className="mobile_btn" id="mobile_btn">
        <i className="fa fa-bars"></i>
      </a>
      <ul className="nav user-menu">
        <li className="nav-item dropdown has-arrow">
          <a
            href="#"
            className="dropdown-toggle nav-link"
            data-bs-toggle="dropdown"
          >
            <span className="user-img">
              <img
                className="rounded-circle"
                src={
                  user?.avatar ||
                  "/theme/admin/assets/img/patients/patient2.jpg"
                }
                width="31"
                alt={user?.lastName || "Administrator"}
              />
            </span>
          </a>
          <div className="dropdown-menu">
            <div className="user-header">
              <div className="avatar avatar-sm">
                <img
                  src={
                    user?.avatar ||
                    "/theme/admin/assets/img/patients/patient2.jpg"
                  }
                  alt="User Image"
                  className="avatar-img rounded-circle"
                />
              </div>
              <div className="user-text">
                <h6>
                  {user?.firstName + " " + user?.lastName || "Chưa đăng nhập"}
                </h6>
                <p className="text-muted mb-0">{user?.role || ""}</p>
              </div>
            </div>
            <a className="dropdown-item" href="./profile">
              My Profile
            </a>
            <a className="dropdown-item" href="#" onClick={handleLogout}>
              Logout
            </a>
          </div>
        </li>
      </ul>
    </div>
  );
}
