"use client";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import moment from "moment";
import { useEffect, useState, useRef } from "react";
import RequireAuth from "../../components/RequireAuth";
import { v4 as uuidv4 } from "uuid";
export default function AppointmentsPage() {
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelCode, setCancelCode] = useState(null);
  const [viewBooking, setViewBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  const dtRef = useRef(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true);
        setError(null);
        const api = `/api/v1/bookings/photographer`;
        const res = await fetch(api, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            Authorization: `${localStorage.getItem("admin_token")}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch bookings");
          // console.log("Loading...");
          // console.log(res);
        } else {
          const data = await res.json();
          setBookings((data?.responseData || []).sort((a, b) => b.id - a.id));
        }
      } catch (err) {
        setError(err.message || "Failed to fetch bookings data");
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  useEffect(() => {
    if (!dtRef.current) {
      dtRef.current = $("#portfolio-table").DataTable({
        autoWidth: false,
        sorting: [[0, "desc"]],
      });
    }
  }, []);

  useEffect(() => {
    if (dtRef.current) {
      dtRef.current.clear();
      if (bookings && bookings.length) {
        bookings.forEach((booking, idx) => {
          dtRef.current.row.add([
            `<b>${booking.bookingCode}</b>` || "-",
            `${moment(booking.date).format("DD/MM/YYYY")} <br/>${
              booking.startTime + " - " + booking.endTime || ""
            }`,
            // booking.servicePackages?.map((pkg) => pkg.name).join(", ") || "-",
            ` ${
              booking.status === "REJECTED"
                ? '<span class="badge rounded-pill bg-danger inv-badge">'
                : '<span class="badge rounded-pill bg-warning inv-badge">'
            }
            ${booking.status || "-"}
            </span>`,
            booking.reasonReject || "-",
            `<span class="badge rounded-pill bg-success inv-badge">
            ${booking.paymentStatus || "-"}
            </span>`,
            booking.totalPayment
              ? booking.totalPayment.toLocaleString("vi-VN")
              : "0",

            booking.commissionRate ? booking.commissionRate + " %" : "0",
            booking.photographerAmount
              ? booking.photographerAmount.toLocaleString("vi-VN")
              : booking.totalPayment.toLocaleString("vi-VN"),
            // `Name: ${booking.customerName || ""} <br/>
            // ${booking.customerEmail || ""}<br/>${booking.email || ""}<br/>${
            //   booking.customerPhone || ""
            // }`,
            `<div class="actions">
             <a
              class="btn btn-sm bg-info-light"
              data-bs-toggle="modal"
              href="#view_modal"
              onclick="window.handleOpenViewModal && window.handleOpenViewModal('${
                booking?.bookingCode
              }')"
            >
              <i class="fe fe-eye"></i> View
            </a>
            ${
              booking?.status != "REJECTED"
                ? `<a
                class="btn btn-sm bg-danger-light"
                data-bs-toggle="modal"
                href="#delete_modal"
                onclick="window.handleOpenCancelModal && window.handleOpenCancelModal('${booking?.bookingCode}')"
              >
                <i class="fe fe-trash"></i> Cancel
              </a>`
                : `
                <button
                disabled
                class="btn btn-sm "
              >
                <i class="fe fe-trash"></i> Cancel
              </button>`
            }
            </div>`,
          ]);
        });
      }
      dtRef.current.draw(false);
    }
  }, [bookings]);
  const handleOpenViewModal = (code) => {
    const booking = bookings?.find((b) => b.bookingCode === code);
    setViewBooking(booking || null);
    setTimeout(() => {
      window.$("#view_modal").modal("show");
    }, 100);
  };
  useEffect(() => {
    window.handleOpenViewModal = handleOpenViewModal;
  }, [bookings]);
  const handleOpenCancelModal = (code) => {
    setCancelCode(code);
    setTimeout(() => {
      const el = document.querySelector("#delete_modal .booking-code");
      if (el) el.textContent = code;
    }, 100);
  };
  const handleCancelBooking = async () => {
    if (!cancelCode) return;
    try {
      const bookingId = bookings.find((b) => b.bookingCode === cancelCode)?.id;
      if (!bookingId) throw new Error("Booking not found");
      const res = await fetch(
        `/api/v1/photographers/bookings/reject/${bookingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("admin_token")}`,
          },
          body: JSON.stringify({
            requestTrace: uuidv4(),
            requestDateTime: moment().toISOString(),
            requestParameters: { reasonReject: cancelReason || "" },
          }),
        }
      );
      const data = await res.json();

      if (!res.ok) throw new Error("Cancel failed");
      // Đóng modal
      window.$("#delete_modal").modal("hide");
      // Reload bookings
      // setBookings((prev) => prev.filter((b) => b.bookingCode !== cancelCode));
      setCancelCode(null);
      setCancelReason("");
      //  reload lai danh sach
      setLoading(true);
      const api = `/api/v1/bookings/photographer`;
      const res2 = await fetch(api, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: `${localStorage.getItem("admin_token")}`,
        },
      });
      const data2 = await res2.json();
      if (!res2.ok) throw new Error("Failed to reload bookings");
      setBookings((data2.responseData || []).sort((a, b) => b.id - a.id));
    } catch (err) {
      console.log(err);

      alert("Cancel booking failed!");
    }
  };
  useEffect(() => {
    window.handleOpenCancelModal = handleOpenCancelModal;
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
                  <h3 className="page-title">Bookings</h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item active">
                      Home{" "}
                      <i
                        className="fa fa-angle-double-right"
                        aria-hidden="true"
                      ></i>{" "}
                      <a href="#">Bookings</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {error ? <div className="alert alert-danger">{error}</div> : null}
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <div className="table-responsive">
                      <table
                        id="portfolio-table"
                        className=" table table-hover table-center mb-0"
                      >
                        <thead>
                          <tr>
                            <th>Booking Code</th>
                            <th>Date Time</th>
                            {/* <th>Services</th> */}
                            <th>Status</th>
                            <th>Reject Reason</th>
                            <th>Payment Status</th>
                            <th>Total Payment</th>
                            <th>Commission</th>
                            <th>You Received</th>
                            {/* <th>Customer Info</th> */}
                            <th className="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody></tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="modal fade"
              id="view_modal"
              aria-hidden="true"
              role="dialog"
            >
              <div
                className="modal-dialog modal-dialog-centered"
                role="document"
              >
                <div className="modal-content">
                  <div className="modal-body">
                    <div className="form-content p-2">
                      {viewBooking ? (
                        <>
                          <h4 className="modal-title">
                            Booking Detail <b>{viewBooking.bookingCode}</b>
                          </h4>

                          <div>
                            <p>
                              <b>Date:</b>{" "}
                              {moment(viewBooking.date).format("DD/MM/YYYY")}
                            </p>
                            <p>
                              <b>Time:</b> {viewBooking.startTime} -{" "}
                              {viewBooking.endTime}
                            </p>
                            <p>
                              <b>Speciality:</b> {viewBooking.speciality}
                            </p>
                            <p>
                              <b>Services:</b>{" "}
                              {viewBooking.servicePackages
                                ?.map((pkg) => pkg.name)
                                .join(", ")}
                            </p>
                            <p>
                              <b>Payment Status:</b>{" "}
                              <span className="badge rounded-pill bg-success inv-badge">
                                {" "}
                                {viewBooking.paymentStatus}
                              </span>
                            </p>
                            <p>
                              <b>Cancel Status:</b>
                              {viewBooking.status == "REJECTED" && (
                                <span className="badge rounded-pill bg-danger inv-badge">
                                  {" "}
                                  {viewBooking.status || "-"}
                                </span>
                              )}
                            </p>
                            <p>
                              <b>Cancel Reason:</b> {viewBooking.reason || "-"}
                            </p>
                            <p>
                              <b>Total Payment:</b>{" "}
                              {viewBooking.totalPayment
                                ? viewBooking.totalPayment.toLocaleString(
                                    "vi-VN"
                                  ) + " đ"
                                : "0"}
                            </p>
                            <p>
                              <b>Payment Method:</b>{" "}
                              {viewBooking.paymentMethod == "QR"
                                ? "QR Code"
                                : viewBooking.paymentMethod || "-"}
                            </p>
                            <p>
                              <b>Customer Info:</b>
                              <br /> {viewBooking.customerName} <br />
                              {viewBooking.customerEmail ||
                                viewBooking.email}{" "}
                              <br />
                              {viewBooking.customerPhone}
                            </p>
                            <p>
                              <b>Created At:</b>{" "}
                              {viewBooking.createdAt
                                ? moment(viewBooking.createdAt).format(
                                    "DD/MM/YYYY"
                                  )
                                : "-"}
                            </p>
                            <p>
                              <b>Note:</b> {viewBooking.note}
                            </p>
                          </div>
                        </>
                      ) : (
                        <p>No detail found.</p>
                      )}
                      <button
                        type="button"
                        className="btn btn-secondary mt-2"
                        data-bs-dismiss="modal"
                        style={{ float: "right", marginRight: "10px" }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="modal fade"
              id="delete_modal"
              aria-hidden="true"
              role="dialog"
            >
              <div
                className="modal-dialog modal-dialog-centered"
                role="document"
              >
                <div className="modal-content">
                  <div className="modal-body">
                    <div className="form-content p-2">
                      <h4 className="modal-title">
                        Cancel Booking {cancelCode}
                      </h4>
                      <p className="mb-4 mt-4">
                        <input
                          type="text"
                          name="reason"
                          className="form-control"
                          placeholder="Enter reason for cancellation"
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          required
                        />
                      </p>

                      <button
                        type="button"
                        className="btn btn-danger"
                        data-bs-dismiss="modal"
                      >
                        Close
                      </button>
                      <span className="ml-10"> </span>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={handleCancelBooking}
                      >
                        Confirm
                      </button>
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
