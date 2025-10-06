"use client";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import moment from "moment";

import { useEffect, useState } from "react";
import RequireAuth from "../../components/RequireAuth";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [role, setRole] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("admin_user") || "{}");
    setUserInfo(user);
    setRole(user?.role);
  }, []);
  useEffect(() => {
    async function fetchReviews() {
      if (!role) return;
      try {
        setLoading(true);
        setError(null);
        let api = "";
        if (role === "PHOTOGRAPHER") {
          api = `/api/v1/feedbacks/photographer/me`;
        } else {
          api = `/api/v1/feedbacks/admin`;
        }
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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, [role]);
  const handleDeleteReview = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/v1/feedbacks/admin/reject/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `${localStorage.getItem("admin_token")}`,
        },
      });
      if (!res.ok) throw new Error("Delete failed");
      // Xóa khỏi state
      setReviews((prev) => prev.filter((r) => r.id !== deleteId));
      setDeleteId(null);
      window.$("#delete_modal").modal("hide");
    } catch (err) {
      alert("Delete review failed!");
    }
  };
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
                  <h3 className="page-title">Reviews</h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item active">
                      Home{" "}
                      <i
                        className="fa fa-angle-double-right"
                        aria-hidden="true"
                      ></i>{" "}
                      <a href="#">Reviews</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-body">
                    <div className="table-responsive">
                      <table
                        id="reviews-table"
                        className="table table-hover table-center mb-0"
                      >
                        <thead>
                          <tr>
                            <th>Photographer Name</th>
                            <th>Booking Code</th>
                            <th>Ratings</th>
                            <th>Comment</th>
                            <th>Comment By</th>
                            <th>Date</th>
                            {role === "ADMIN" && <th>Actions</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {/* sample rows converted from template */}

                          {loading ? (
                            <tr>
                              <td colSpan="7">Loading...</td>
                            </tr>
                          ) : error ? (
                            <tr>
                              <td colSpan="7">Error: {error}</td>
                            </tr>
                          ) : reviews && reviews.length === 0 ? (
                            <tr>
                              <td colSpan="7">No reviews found.</td>
                            </tr>
                          ) : (
                            // lặp qua reviews và hiển thị
                            reviews &&
                            reviews.map((review, index) => (
                              <tr key={review.id}>
                                <td>
                                  <h2 className="table-avatar">
                                    {review.photographerName}
                                  </h2>
                                </td>
                                <td>
                                  <h2 className="table-avatar">
                                    {review.bookingCode}
                                  </h2>
                                </td>
                                <td>
                                  {[...Array(review.rating || 5)].map(
                                    (_, i) => (
                                      <i
                                        key={i}
                                        className="fa fa-star text-warning"
                                      />
                                    )
                                  )}
                                </td>
                                <td>{review.comment}</td>
                                <td>
                                  <h2 className="table-avatar">
                                    {review.customerName}
                                  </h2>

                                  <br />
                                  <a href={`mailto:${review.customerEmail}`}>
                                    {review.customerEmail}
                                  </a>
                                </td>
                                <td>
                                  {moment(review.createdAt).format(
                                    "DD/MM/YYYY HH:mm"
                                  )}
                                </td>
                                {role === "ADMIN" && (
                                  <td>
                                    <div className="actions">
                                      <a
                                        className="btn btn-sm bg-danger-light"
                                        data-bs-toggle="modal"
                                        href="#delete_modal"
                                        onClick={() => setDeleteId(review.id)}
                                      >
                                        <i className="fe fe-trash" /> Delete
                                      </a>
                                    </div>
                                  </td>
                                )}
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

            {/* Delete Modal (kept simple) */}
            {role === "ADMIN" && (
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
                        <h4 className="modal-title">Delete</h4>
                        <p className="mb-4">
                          Are you sure want to delete this review?
                        </p>

                        <span className="ml-10"> </span>
                        <button
                          type="button"
                          className="btn btn-danger"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                        <span className="ml-10"> </span>
                        <button
                          type="button"
                          className="btn btn-primary"
                          href="#delete_modal"
                          onClick={handleDeleteReview}
                        >
                          Delete
                        </button>
                      </div>
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
