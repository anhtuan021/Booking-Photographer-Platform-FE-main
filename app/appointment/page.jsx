"use client";
import React, { useEffect, useState } from "react";

export default function AppointmentPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    try {
      const userInfo = localStorage.getItem("user");
      if (!userInfo) throw new Error("User not logged in");
      // const myBookings =
      //   JSON.parse(localStorage.getItem(`myBookings_ID${userInfo.id}`)) || [];
      // setBookings(myBookings);
    } catch (e) {
      console.log(e);
    }
    async function fetchBookings() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("user_token");
        const res = await fetch("/api/v1/bookings/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // if (!res.ok) throw new Error("Can not get bookings");
        if (res.status === 403) {
          setBookings([]);
          return;
        } else if (res.status === 401) {
          setBookings([]);
          setIsAuthenticated(false);
          setError("User is not authenticated. Please log in to continue.");

          return;
        }
        const data = await res.json();
        setBookings(
          data.responseData.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          ) || []
        );
        setIsAuthenticated(true);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  return (
    <>
      <div className="breadcrumb-bar">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <h2 className="breadcrumb-title">My Appointments</h2>
              </nav>
            </div>
          </div>
        </div>
        <div className="breadcrumb-bg">
          <img
            src="theme/assets/img/bg/breadcrumb-bg-01.png"
            alt="img"
            className="breadcrumb-bg-01"
          />
          <img
            src="theme/assets/img/bg/breadcrumb-bg-02.png"
            alt="img"
            className="breadcrumb-bg-02"
          />
          <img
            src="theme/assets/img/bg/breadcrumb-icon.png"
            alt="img"
            className="breadcrumb-bg-03"
          />
          <img
            src="theme/assets/img/bg/breadcrumb-icon.png"
            alt="img"
            className="breadcrumb-bg-04"
          />
        </div>
      </div>

      {/* Page Content */}
      <div className="content doctor-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-xl-12">
              <div className="dashboard-header">
                <h3>Appointments</h3>
              </div>

              {/* <div className="search-header">
                <div className="search-field">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search"
                  />
                  <span className="search-icon">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </span>
                </div>
              </div> */}
              {loading && <p>Loading...</p>}
              {error && <p className="text-danger">{error}</p>}
              <div className="custom-table">
                <div className="table-responsive">
                  <table className="table table-center mb-0">
                    <thead>
                      <tr>
                        <th>Booking Code</th>
                        <th>Appointment Date</th>
                        <th>Price</th>
                        <th>Total Discount</th>
                        <th>Total Payment</th>
                        <th>Payment Status</th>
                        <th>Status</th>
                        <th>Reason</th>
                        <th>Customer Info</th>
                        <th>Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.length === 0 ? (
                        <tr>
                          <td colSpan={11} className="text-center">
                            No bookings found.
                          </td>
                        </tr>
                      ) : (
                        bookings.map((booking, idx) => (
                          <tr key={idx}>
                            <td>
                              <b>{booking.bookingCode}</b>
                            </td>
                            <td>
                              {booking.date}
                              <br />{" "}
                              <span className="text-primary">
                                {booking.startTime} - {booking.endTime}
                              </span>
                            </td>
                            <td>{booking.price?.toLocaleString("vi-VN")} đ</td>
                            <td>
                              -{booking.totalDiscount?.toLocaleString("vi-VN")}{" "}
                              đ
                            </td>
                            <td>
                              {booking.totalPayment?.toLocaleString("vi-VN")} đ
                            </td>
                            <td>
                              <span className="text-success">
                                {booking.paymentStatus}
                              </span>
                            </td>
                            <td>
                              <span
                                className={
                                  booking.status !== "REJECTED"
                                    ? "text-success"
                                    : "text-danger"
                                }
                              >
                                {booking.status}
                              </span>
                            </td>
                            <td>
                              {booking.reasonReject || booking.reason || "-"}
                            </td>
                            <td>
                              {booking.customerName}
                              <br />
                              {booking.customerEmail}
                              <br />
                              {booking.customerPhone}
                            </td>
                            <td>{booking.note || "-"}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* <div className="pagination dashboard-pagination">
                <ul>
                  <li>
                    <a href="#" className="page-link">
                      <i className="fa-solid fa-chevron-left"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="page-link">
                      1
                    </a>
                  </li>
                  <li>
                    <a href="#" className="page-link active">
                      2
                    </a>
                  </li>
                  <li>
                    <a href="#" className="page-link">
                      3
                    </a>
                  </li>
                  <li>
                    <a href="#" className="page-link">
                      4
                    </a>
                  </li>
                  <li>
                    <a href="#" className="page-link">
                      ...
                    </a>
                  </li>
                  <li>
                    <a href="#" className="page-link">
                      <i className="fa-solid fa-chevron-right"></i>
                    </a>
                  </li>
                </ul>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
