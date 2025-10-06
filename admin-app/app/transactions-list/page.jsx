"use client";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import RequireAuth from "../../components/RequireAuth";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function TransactionLists() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorBookings, setErrorBookings] = useState("");
  const [reviews, setReviews] = useState(null);
  const [viewReview, setViewReview] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
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
        const sorted = (data.responseData || []).sort((a, b) => b.id - a.id);
        setBookings(sorted);
      } catch (err) {
        setErrorBookings(err.message || "Error fetching bookings");
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);
  useEffect(() => {
    async function fetchReviews() {
      try {
        setErrorBookings(null);
        let api = "";
        api = `/api/v1/feedbacks/admin`;
        const res = await fetch(api, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            Authorization: `${localStorage.getItem("admin_token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        setReviews(data?.responseData || []);
      } catch (err) {
        setErrorBookings(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, [bookings]);
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
                  <h3 className="page-title">Bookings Management </h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item active">
                      Home{" "}
                      <i
                        className="fa fa-angle-double-right"
                        aria-hidden="true"
                      ></i>{" "}
                      <a href="#">Bookings Management</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className="card card-table">
                  <div className="card-header">
                    <h4 className="card-title">Bookings List</h4>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover table-center mb-0">
                        <thead>
                          <tr>
                            <th>Booking Code</th>
                            <th>Photographer Name</th>
                            <th>Customer Name</th>
                            <th>Payment Status</th>
                            <th>Status</th>
                            <th>Reason Reject</th>
                            <th>Payment Amount</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (
                            <tr>
                              <td colSpan={10}>Loading...</td>
                            </tr>
                          ) : errorBookings ? (
                            <tr>
                              <td colSpan={10} className="text-danger">
                                {errorBookings}
                              </td>
                            </tr>
                          ) : bookings.length === 0 ? (
                            <tr>
                              <td colSpan={10}>No data available</td>
                            </tr>
                          ) : (
                            bookings.map((booking) => (
                              <tr key={booking.id}>
                                <td>
                                  <h2 className="table-avatar">
                                    <b>{booking.bookingCode || "-"}</b>
                                  </h2>
                                </td>
                                <td>
                                  <h2 className="table-avatar">
                                    {booking.photographerName || "-"}
                                  </h2>
                                </td>
                                <td>
                                  <h2 className="table-avatar">
                                    <a href="#">
                                      {booking.customerEmail || "-"} <br />
                                      {booking.customerName || "-"}
                                    </a>
                                  </h2>
                                </td>
                                <td>
                                  <div className="status-toggle">
                                    {/* <input
                                      type="checkbox"
                                      id="status_1"
                                      className="check"
                                      defaultChecked={true}
                                    />
                                    <label
                                      htmlFor="status_1"
                                      className="checktoggle"
                                    >
                                      {booking.paymentStatus || "-"}
                                    </label> */}
                                    <span className="text-success">
                                      {booking.paymentStatus || "-"}
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  <div className="status-toggle">
                                    <span
                                      className={`badge rounded-pill inv-badge ${
                                        booking.status === "REJECTED"
                                          ? "bg-danger"
                                          : "bg-warning"
                                      }`}
                                    >
                                      {booking.status || "-"}
                                    </span>
                                  </div>
                                </td>
                                <td>{booking.reasonReject || "-"}</td>
                                <td>
                                  {booking.totalPayment?.toLocaleString(
                                    "vi-VN"
                                  ) || "0"}{" "}
                                </td>
                                <td>
                                  <a
                                    class="btn btn-sm bg-warning-light"
                                    onClick={() => {
                                      const review = reviews?.find(
                                        (r) => r.bookingId === booking.id
                                      );
                                      setViewReview(review || null);
                                      setShowReviewModal(true);
                                    }}
                                  >
                                    <i
                                      class="fa fa-list"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    View Review
                                  </a>
                                  <br />
                                  <a
                                    className="btn btn-sm bg-info-light me-2 mt-2"
                                    onClick={() => {
                                      setViewBooking(booking);
                                      setShowBookingModal(true);
                                    }}
                                  >
                                    <i
                                      className="fa fa-eye"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    View Detail
                                  </a>
                                </td>
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
            {showReviewModal && (
              <div
                className="modal fade show"
                style={{ display: "block", background: "rgba(0,0,0,0.3)" }}
                tabIndex={-1}
                role="dialog"
              >
                <div
                  className="modal-dialog modal-dialog-centered"
                  role="document"
                >
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Review Detail</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowReviewModal(false)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      {viewReview ? (
                        <>
                          <p>
                            <b>Comment:</b> {viewReview.comment || "-"}
                          </p>
                          <p>
                            <b>Rating:</b>{" "}
                            {[...Array(viewReview.rating || 0)].map((_, i) => (
                              <i key={i} className="fa fa-star text-warning" />
                            ))}
                          </p>

                          <p>
                            <b>Comment By:</b> {viewReview.customerName || "-"}
                          </p>
                          <p>
                            <b>Send At:</b>{" "}
                            {viewReview.createdAt
                              ? new Date(viewReview.createdAt).toLocaleString(
                                  "vi-VN"
                                )
                              : "-"}
                          </p>
                        </>
                      ) : (
                        <div>No review found for this booking.</div>
                      )}
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowReviewModal(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {showBookingModal && (
              <div
                className="modal fade show"
                style={{ display: "block", background: "rgba(0,0,0,0.3)" }}
                tabIndex={-1}
                role="dialog"
              >
                <div
                  className="modal-dialog modal-dialog-centered"
                  role="document"
                >
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Booking Detail</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowBookingModal(false)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      {viewBooking ? (
                        <>
                          <p>
                            <b>Booking Code:</b>{" "}
                            {viewBooking.bookingCode || "-"}
                          </p>
                          <p>
                            <b>Photographer:</b>{" "}
                            {viewBooking.photographerName || "-"}
                          </p>
                          <p>
                            <b>Speciality:</b> {viewBooking.speciality || "-"}
                          </p>
                          <p>
                            <b>Customer:</b> {viewBooking.customerName || "-"}
                          </p>
                          <p>
                            <b>Customer Email:</b>{" "}
                            {viewBooking.customerEmail || "-"}
                          </p>
                          <p>
                            <b>Appointment Time:</b> {viewBooking.date || "-"}{" "}
                            {viewBooking.startTime && viewBooking.endTime
                              ? `(${viewBooking.startTime} - ${viewBooking.endTime})`
                              : ""}
                          </p>
                          <p>
                            <b>Note:</b> {viewBooking.note || "-"}
                          </p>
                          <p>
                            <b>Payment Status:</b>{" "}
                            <span className="badge rounded-pill inv-badge bg-success">
                              {viewBooking.paymentStatus || "-"}
                            </span>
                          </p>

                          <p>
                            <b>Status:</b>{" "}
                            <span
                              className={`badge rounded-pill inv-badge ${
                                viewBooking.status === "REJECTED"
                                  ? "bg-danger"
                                  : viewBooking.status === "PENDING" ||
                                    viewBooking.status === "IN_PROGRESS"
                                  ? "bg-warning"
                                  : "bg-success"
                              }`}
                            >
                              {viewBooking.status || "-"}
                            </span>
                          </p>
                          <p>
                            <b>Reason Reject:</b>{" "}
                            {viewBooking.reasonReject || "-"}
                          </p>
                          <hr />
                          <p>
                            <b>Payment Amount:</b>{" "}
                            {viewBooking.totalPayment?.toLocaleString(
                              "vi-VN"
                            ) || "0"}
                          </p>
                          <p>
                            <b>Commission Rate:</b>{" "}
                            {viewBooking.commissionRate?.toLocaleString(
                              "vi-VN"
                            ) || "0"}
                          </p>
                          <p>
                            <b>Admin Amount:</b>{" "}
                            {viewBooking.adminAmount?.toLocaleString("vi-VN") ||
                              "0"}
                          </p>
                          <p>
                            <b>Photographer Amount:</b>{" "}
                            {viewBooking.photographerAmount?.toLocaleString(
                              "vi-VN"
                            ) || "0"}
                          </p>
                          <hr />

                          <p>
                            <b>Created At:</b>{" "}
                            {viewBooking.createdAt
                              ? new Date(viewBooking.createdAt).toLocaleString(
                                  "vi-VN"
                                )
                              : "-"}
                          </p>
                        </>
                      ) : (
                        <div>No detail found.</div>
                      )}
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowBookingModal(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
