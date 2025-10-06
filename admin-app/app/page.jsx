"use client";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import RequireAuth from "../components/RequireAuth";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function AdminHome() {
  const user = useSelector((state) => {
    return state.auth.user;
  });
  const [photographers, setPhotographers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorPhotographers, setErrorPhotographers] = useState("");
  const [errorCustomers, setErrorCustomers] = useState("");
  const [errorBookings, setErrorBookings] = useState("");

  useEffect(() => {
    async function fetchPhotographers() {
      setLoading(true);
      setErrorPhotographers("");
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("admin_token")
            : "";
        const api = `/api/v1/photographers/search`;
        const res = await fetch(api, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch photographers");
        const data = await res.json();
        const sorted = (data.responseData || [])

          .filter((item) => item.id)
          .sort((a, b) => b.id - a.id)
          .slice(0, 10);
        setPhotographers(sorted);
      } catch (err) {
        setErrorPhotographers(err.message || "Error fetching photographers");
      } finally {
        setLoading(false);
      }
    }
    fetchPhotographers();
  }, []);
  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      setErrorCustomers("");
      try {
        const api = `/api/v1/customers`;
        const res = await fetch(api, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch customers");
        const data = await res.json();
        const sorted = (data.responseData || [])

          .filter((item) => item.id)
          .sort((a, b) => a.id - b.id)
          .slice(0, 10);
        setCustomers(sorted);
      } catch (err) {
        setErrorCustomers(err.message || "Error fetching customers");
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);
  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      setErrorBookings("");
      try {
        const api = `/api/v1/bookings`;
        const res = await fetch(api, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();
        const sorted = (data.responseData || [])

          .filter((item) => item.id)
          .sort((a, b) => a.id - b.id)
          .slice(0, 10);
        setBookings(sorted);
      } catch (err) {
        setErrorBookings(err.message || "Error fetching bookings");
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  return (
    <RequireAuth>
      <div className="main-wrapper">
        <Header />
        <Sidebar />
        <div className="page-wrapper">
          <div className="content container-fluid">
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <h3 className="page-title">
                    Welcome {user?.role} |{" "}
                    {user?.firstName + " " + user?.lastName || ""}!
                  </h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item active">Dashboard</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-3 col-sm-6 col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="dash-widget-header">
                      <span className="dash-widget-icon text-primary border-primary">
                        <i className="fe fe-users"></i>
                      </span>
                      <div className="dash-count">
                        <h3>
                          {loading
                            ? "..."
                            : errorPhotographers
                            ? "!"
                            : photographers.length}
                        </h3>
                      </div>
                    </div>
                    <div className="dash-widget-info">
                      <h6 className="text-muted">Photographers</h6>
                      <div className="progress progress-sm">
                        <div className="progress-bar bg-primary w-50"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-sm-6 col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="dash-widget-header">
                      <span className="dash-widget-icon text-success">
                        <i className="fe fe-credit-card"></i>
                      </span>
                      <div className="dash-count">
                        <h3>
                          {loading
                            ? "..."
                            : errorCustomers
                            ? "!"
                            : customers.length}
                        </h3>
                      </div>
                    </div>
                    <div className="dash-widget-info">
                      <h6 className="text-muted">Customers</h6>
                      <div className="progress progress-sm">
                        <div className="progress-bar bg-success w-50"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-sm-6 col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="dash-widget-header">
                      <span className="dash-widget-icon text-danger border-danger">
                        <i className="fe fe-money"></i>
                      </span>
                      <div className="dash-count">
                        <h3>
                          {loading
                            ? "..."
                            : errorBookings
                            ? "!"
                            : bookings.length}
                        </h3>
                      </div>
                    </div>
                    <div className="dash-widget-info">
                      <h6 className="text-muted">Bookings</h6>
                      <div className="progress progress-sm">
                        <div className="progress-bar bg-danger w-50"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-sm-6 col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="dash-widget-header">
                      <span className="dash-widget-icon text-warning border-warning">
                        <i className="fe fe-folder"></i>
                      </span>
                      <div className="dash-count">
                        <h3>
                          {loading
                            ? "..."
                            : errorBookings
                            ? "!"
                            : Number(
                                bookings

                                  .map((b) => {
                                    return moment(b.date).isSame(
                                      moment(),
                                      "month"
                                    )
                                      ? b.totalPayment || 0
                                      : 0;
                                  })
                                  .reduce((a, b) => a + b, 0)
                              ).toLocaleString("vi-VN") || 0}
                        </h3>
                      </div>
                    </div>
                    <div className="dash-widget-info">
                      <h6 className="text-muted">Monthly Revenue</h6>
                      <div className="progress progress-sm">
                        <div className="progress-bar bg-warning w-50"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 d-flex">
                <div className="card card-table flex-fill">
                  <div className="card-header">
                    <h4 className="card-title">Photographers List</h4>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover table-center mb-0">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Photographer Name</th>
                            <th>Email</th>
                            <th>Speciality</th>
                            <th>Status</th>
                            {/* <th>Reviews</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (
                            <tr>
                              <td colSpan={4}>Loading...</td>
                            </tr>
                          ) : errorPhotographers ? (
                            <tr>
                              <td colSpan={4} className="text-danger">
                                {errorPhotographers}
                              </td>
                            </tr>
                          ) : photographers.length === 0 ? (
                            <tr>
                              <td colSpan={4}>No data available</td>
                            </tr>
                          ) : (
                            photographers.map((item) => (
                              <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>
                                  <h2 className="table-avatar">
                                    <a
                                      href="#"
                                      className="avatar avatar-sm me-2"
                                    >
                                      <img
                                        className="avatar-img rounded-circle"
                                        src={
                                          item.avatarUrl ||
                                          "/theme/admin/assets/img/doctors/doctor-thumb-01.jpg"
                                        }
                                        alt="User Image"
                                      />
                                    </a>
                                    <a href="#">
                                      {item.businessName || item.title || "-"}
                                    </a>
                                  </h2>
                                </td>
                                <td>{item.email || "-"}</td>
                                <td>
                                  {item.specialties
                                    ?.map((spec) => spec)
                                    .join(", ") || "-"}
                                </td>
                                <td>{item.status || "-"}</td>
                                {/* <td>
                                  <i className="fe fe-star text-warning"></i>
                                  <i className="fe fe-star text-warning"></i>
                                  <i className="fe fe-star text-warning"></i>
                                  <i className="fe fe-star text-warning"></i>
                                  <i className="fe fe-star-o text-secondary"></i>
                                </td> */}
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 d-flex">
                <div className="card  card-table flex-fill">
                  <div className="card-header">
                    <h4 className="card-title">Customers List</h4>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover table-center mb-0">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Customer Name</th>
                            <th>Date of Birth</th>
                            <th>Email</th>
                            <th>Phone</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (
                            <tr>
                              <td colSpan={4}>Loading...</td>
                            </tr>
                          ) : errorCustomers ? (
                            <tr>
                              <td colSpan={4} className="text-danger">
                                {errorCustomers}
                              </td>
                            </tr>
                          ) : customers.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="text-center">
                                No data available{" "}
                              </td>
                            </tr>
                          ) : (
                            customers.map((customer, idx) => (
                              <tr key={idx}>
                                <td>{customer.id}</td>

                                <td>
                                  <h2 className="table-avatar">
                                    <a href="#">
                                      {customer.firstName +
                                        " " +
                                        customer.lastName}
                                      {" " || "-"}
                                    </a>
                                  </h2>
                                </td>
                                <td>
                                  {customer.dateOfBirth
                                    ? moment(customer.dateOfBirth).format(
                                        "DD/MM/YYYY"
                                      )
                                    : "-"}
                                </td>
                                <td>{customer.email || "-"}</td>
                                <td>{customer.phone || "-"}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
