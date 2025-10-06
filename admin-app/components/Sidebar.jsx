import { useSelector } from "react-redux";

export default function Sidebar() {
  let user = useSelector((state) => state.auth.user);
  if (!user && typeof window !== "undefined") {
    try {
      user = JSON.parse(localStorage.getItem("admin_user"));
    } catch {}
  }
  const role = user?.role || "";

  return (
    <div className="sidebar" id="sidebar">
      <div className="sidebar-inner slimscroll">
        <div id="sidebar-menu" className="sidebar-menu">
          <ul>
            <li className="menu-title">
              <span></span>
            </li>
            {role === "ADMIN" ? (
              <>
                <li>
                  <a href="./">
                    <i className="fe fe-home"></i> <span>Dashboard</span>
                  </a>
                </li>

                <li>
                  <a href="./photographers">
                    <i className="fe fe-user-plus"></i>{" "}
                    <span>Photographers</span>
                  </a>
                </li>
                <li>
                  <a href="./transactions-list">
                    <i className="fe fe-activity"></i>{" "}
                    <span>Bookings Management</span>
                  </a>
                </li>

                {/* <li>
                  <a href="./customers">
                    <i className="fe fe-user-plus"></i> <span>Customers</span>
                  </a>
                </li> */}
                <li>
                  <a href="./reviews">
                    <i className="fe fe-star-o"></i>{" "}
                    <span>Reviews Management</span>
                  </a>
                </li>
                <li>
                  <a href="./profile">
                    <i className="fe fe-user-plus"></i> <span>Profile</span>
                  </a>
                </li>
              </>
            ) : role === "PHOTOGRAPHER" ? (
              <>
                <li>
                  <a href="./appointments">
                    <i className="fe fe-layout"></i> <span>Bookings</span>
                  </a>
                </li>
                <li>
                  <a href="./gallery">
                    <i className="fe fe-vector"></i> <span>Portfolios</span>
                  </a>
                </li>
                {/* <li>
                  <a href="./transactions-list">
                    <i className="fe fe-activity"></i> <span>Transactions</span>
                  </a>
                </li> */}

                <li>
                  <a href="./reviews">
                    <i className="fe fe-star-o"></i> <span>Reviews</span>
                  </a>
                </li>

                <li>
                  <a href="./profile">
                    <i className="fe fe-user-plus"></i> <span>Profile</span>
                  </a>
                </li>
              </>
            ) : (
              <></>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
