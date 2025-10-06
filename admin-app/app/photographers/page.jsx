"use client";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import RequireAuth from "../../components/RequireAuth";
import { useEffect, useState, useRef } from "react";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

export default function PhotographersPage() {
  const [photographers, setPhotographers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dtRef = useRef(null);
  const [viewPhotographer, setViewPhotographer] = useState(null);
  const [photographerReviews, setPhotographerReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [photographerDetail, setPhotographerDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  // Fetch photographers
  useEffect(() => {
    async function fetchPhotographers() {
      try {
        setLoading(true);
        setError(null);
        const api = `/api/v1/photographers/search`;
        const res = await fetch(api, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            Authorization: `${localStorage.getItem("admin_token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch Photographers");
        const data = await res.json();
        setPhotographers(
          (data?.responseData || []).sort((a, b) => a.id - b.id)
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPhotographers();
  }, []);

  useEffect(() => {
    if (!dtRef.current) {
      dtRef.current = $("#photographers-table").DataTable({
        autoWidth: false,
      });
    }
  }, []);
  useEffect(() => {
    if (dtRef.current) {
      dtRef.current.clear();
      if (photographers && photographers.length) {
        photographers.forEach((item, idx) => {
          dtRef.current.row.add([
            idx + 1,
            `<a href="#" class="photographer-name-link" data-index="${idx}">${
              item.businessName || item.name || "-"
            }</a>`,
            item.email ? item.email : "-",
            item.speciality || "-",
            item.yearsExperience || "-",
            `
              <span class="badge badge-pill ${
                item.status === "ACTIVE"
                  ? "badge-success"
                  : item.status === "PENDING"
                  ? "badge-warning"
                  : "badge-danger"
              }">${item.status || "-"}</span>
            `,
            item.status !== "ACTIVE"
              ? `
              <div class="status-toggle">
                <input type="checkbox" id="status_${idx}" class="check">
                <label for="status_${idx}" class="checktoggle">checkbox</label>
              </div>
            `
              : `
              <div class="status-toggle">
                <input type="checkbox" id="status_${idx}" class="check" checked="">
                <label for="status_${idx}" class="checktoggle">checkbox</label>
              </div>
            `,
            `
              <div class="actions">
                 <a
                  id="view-detail-review" data-index="${idx}"
                  class="btn btn-sm bg-warning-light"
                  data-bs-toggle="modal"
                  data-bs-target="#view_review_photographer_modal"
                >
                  <i class="fa fa-list" aria-hidden="true"></i> Reviews
                </a>
                <a
                  id="view-detail" data-index="${idx}"
                  class="btn btn-sm bg-success-light"
                  data-bs-toggle="modal"
                  data-bs-target="#view_photographer_modal"
                >
                  <i class="fa fa-eye" aria-hidden="true"></i> View Detail
                </a>
              </div>
            `,
          ]);
        });
      }
      dtRef.current.draw(false);
    }
  }, [photographers]);

  useEffect(() => {
    if (dtRef.current) {
      // Xóa sự kiện cũ để tránh lặp
      $("#photographers-table").off("change", "input[type=checkbox].check");
      // Lắng nghe sự kiện toggle
      $("#photographers-table").on(
        "change",
        "input[type=checkbox].check",
        async function (e) {
          const idx = $(this).attr("id").replace("status_", "");
          const photographer = photographers[idx];
          if (!photographer) return;
          // Nếu status khác INACTIVE thì thực hiện INACTIVE
          let updateStatus = "INACTIVE";
          if (photographer.status == "ACTIVE") {
            updateStatus = "INACTIVE";
          } else if (photographer.status == "INACTIVE") {
            updateStatus = "ACTIVE";
          } else if (photographer.status == "PENDING") {
            updateStatus = "ACTIVE";
          }
          console.log({ status: photographer.status, updateStatus });

          try {
            const res = await fetch(
              `/api/v1/admin/users/status/${photographer.photographerId}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem(
                    "admin_token"
                  )}`,
                },
                body: JSON.stringify({
                  requestTrace: uuidv4(),
                  requestDateTime: moment().toISOString(),
                  requestParameters: {
                    status: updateStatus,
                  },
                }),
              }
            );
            if (!res.ok) throw new Error("Failed to inactive user");
            // Reload lại danh sách
            const getRes = await fetch(`/api/v1/photographers/search`, {
              headers: {
                Authorization: `${localStorage.getItem("admin_token")}`,
              },
            });
            const getData = await getRes.json();
            setPhotographers(
              (getData?.responseData || []).sort((a, b) => a.id - b.id)
            );
          } catch (err) {
            alert("Inactive failed: " + err.message);
          }
        }
      );
    }
  }, [photographers]);
  // view detail photographer
  useEffect(() => {
    if (dtRef.current) {
      // Xóa sự kiện cũ để tránh lặp
      $("#photographers-table").off("click", "#view-detail");
      // Lắng nghe click vào tên photographer
      $("#photographers-table").on("click", "#view-detail", function (e) {
        e.preventDefault();
        const idx = $(this).data("index");
        const photographer = photographers[idx];
        if (photographer) {
          setViewPhotographer(photographer);
          setLoadingDetail(true);
          setPhotographerDetail(null);
          // Gọi API lấy chi tiết
          fetch(`/api/v1/photographers/search?id=${photographer.id}`, {
            headers: {
              "Content-Type": "application/json",
              Accept: "*/*",
              Authorization: `${localStorage.getItem("admin_token")}`,
            },
          })
            .then((res) => res.json())
            .then((data) => {
              // responseData có thể là mảng, lấy phần tử đầu tiên
              setPhotographerDetail(
                Array.isArray(data?.responseData)
                  ? data.responseData[0]
                  : data?.responseData || null
              );
            })
            .catch(() => setPhotographerDetail(null))
            .finally(() => setLoadingDetail(false));
          setTimeout(() => {
            window.$("#view_photographer_modal").modal("show");
          }, 100);
        }
      });
    }
  }, [photographers]);
  // view detail reviews
  useEffect(() => {
    if (dtRef.current) {
      // Xóa sự kiện cũ để tránh lặp
      $("#photographers-table").off("click", "#view-detail-review");
      // Lắng nghe click vào tên photographer
      $("#photographers-table").on(
        "click",
        "#view-detail-review",
        function (e) {
          e.preventDefault();
          const idx = $(this).data("index");
          const photographer = photographers[idx];
          if (photographer) {
            setLoadingReviews(true);
            fetch(`/api/v1/feedbacks/photographer/${photographer.id}`, {
              headers: {},
            })
              .then((res) => res.json())
              .then((data) => setPhotographerReviews(data?.responseData || []))
              .catch(() => setPhotographerReviews([]))
              .finally(() => setLoadingReviews(false));
            setTimeout(() => {
              window.$("#view_review_photographer_modal").modal("show");
            }, 100);
          }
        }
      );
    }
  }, [photographers]);
  return (
    <RequireAuth>
      <div className="main-wrapper">
        <Header />
        <Sidebar />

        <div className="page-wrapper">
          <div className="content container-fluid">
            <div className="page-header">
              <div className="row">
                <div className="col-sm-10">
                  <h3 className="page-title">
                    <span> List of Photographers </span>
                  </h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item active">
                      Home{" "}
                      <i
                        className="fa fa-angle-double-right"
                        aria-hidden="true"
                      ></i>{" "}
                      <a href="#">Photographers</a>
                    </li>
                  </ul>
                </div>
                {/* <div className="col-sm-2" style={{ textAlign: "right" }}>
                  <a
                    href="./add-photographer"
                    className="btn btn-primary btn-rounded float-right"
                  >
                    <i className="fa fa-plus"></i> Add Photographer
                  </a>
                </div> */}
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                {error && (
                  <div className="alert alert-danger mt-2">{error}</div>
                )}
                <div className="card">
                  <div className="card-body">
                    <div className="table-responsive">
                      <table
                        id="photographers-table"
                        className=" table table-hover table-center mb-0"
                      >
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Photographers Name</th>
                            <th>Email</th>
                            <th>Speciality</th>
                            <th>Years of Experience</th>
                            <th>Account Status</th>
                            <th>Active</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody> </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="modal fade"
              id="view_photographer_modal"
              aria-hidden="true"
              role="dialog"
            >
              <div
                className="modal-dialog modal-dialog-centered modal-lg"
                role="document"
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Photographer Detail</h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    {viewPhotographer ? (
                      <div>
                        <p>
                          <b>Business Name:</b>{" "}
                          {viewPhotographer.businessName || "-"}
                        </p>
                        <p>
                          <b>Full Name:</b>{" "}
                          {viewPhotographer.firstName +
                            " " +
                            viewPhotographer.lastName || "-"}
                        </p>
                        <p>
                          <b>Email:</b> {viewPhotographer.email || "-"}
                        </p>
                        <p>
                          <b>Phone Number: </b> {viewPhotographer.phone || "-"}
                        </p>

                        <p>
                          <b>Speciality:</b>{" "}
                          {viewPhotographer.specialties?.join(", ") || "-"}
                        </p>
                        <p>
                          <b>Languages:</b>{" "}
                          {viewPhotographer.languages?.join(", ") || "-"}
                        </p>
                        <p>
                          <b>Years of Experience:</b>{" "}
                          {viewPhotographer.yearsExperience || "-"}
                        </p>
                        <p>
                          <b>Status:</b>
                          <span
                            className={`badge rounded-pill inv-badge ${
                              viewPhotographer.status == "INACTIVE"
                                ? "bg-danger"
                                : viewPhotographer.status == "ACTIVE"
                                ? "bg-success"
                                : "bg-warning"
                            }`}
                          >
                            {viewPhotographer.status || "-"}
                          </span>
                        </p>
                        <p>
                          <b>Bio:</b> {viewPhotographer.bio || "-"}
                        </p>
                        <p>
                          <b>Location:</b>{" "}
                          {viewPhotographer.locationAddress +
                            " " +
                            viewPhotographer.ward +
                            " " +
                            viewPhotographer.city || "-"}
                        </p>
                        <p>
                          <b>Min Price:</b>{" "}
                          {viewPhotographer.minPrice
                            ? Number(viewPhotographer.minPrice).toLocaleString(
                                "vi-VN"
                              ) + " VND"
                            : "-"}
                        </p>
                        <hr />
                        <p>
                          <b>Average Rating:</b>{" "}
                          {viewPhotographer.averageRating || "5"}
                        </p>
                        <p>
                          <b>Total Bookings:</b>{" "}
                          {viewPhotographer.totalBookings || "0"}
                        </p>
                        <p>
                          <b>Total Feedbacks:</b>{" "}
                          {viewPhotographer.totalFeedbacks || "0"}
                        </p>
                        <hr />
                      </div>
                    ) : (
                      <div>No detail found.</div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="modal fade"
              id="view_review_photographer_modal"
              aria-hidden="true"
              role="dialog"
            >
              <div
                className="modal-dialog modal-dialog-centered modal-lg"
                role="document"
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Photographer Reviews</h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    {loadingReviews ? (
                      <div>Loading reviews...</div>
                    ) : photographerReviews.length === 0 ? (
                      <div>No reviews found.</div>
                    ) : (
                      <div style={{ maxHeight: 250, overflowY: "auto" }}>
                        {photographerReviews.map((review, idx) => (
                          <div
                            key={idx}
                            style={{
                              borderBottom: "1px solid #eee",
                              marginBottom: 8,
                              paddingBottom: 8,
                            }}
                          >
                            <div>
                              <b>{review.customerName || "Anonymous"}</b>
                              <span style={{ marginLeft: 8, color: "#f39c12" }}>
                                {Array(review.rating)
                                  .fill(0)
                                  .map((_, i) => (
                                    <i key={i} className="fa fa-star" />
                                  ))}
                              </span>
                            </div>
                            <div>{review.comment}</div>
                            <div
                              className="text-muted"
                              style={{ fontSize: 12 }}
                            >
                              {review.createdAt
                                ? new Date(review.createdAt).toLocaleDateString(
                                    "vi-VN"
                                  )
                                : ""}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
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
