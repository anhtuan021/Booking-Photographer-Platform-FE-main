"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import moment from "moment";
export default function PhotographerPage({ params }) {
  const { id } = params;
  const [photographer, setPhotographer] = useState(null);
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);

  const [userBookings, setBookings] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewBookingId, setReviewBookingId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [bookingHasReview, setBookingHasReview] = useState([]);
  useEffect(() => {
    async function fetchPhotographer() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/v1/photographers/search?id=${id}`);
        if (!res.ok) throw new Error("Không thể lấy thông tin photographer");
        const data = await res.json();
        setPhotographer(
          data && data.responseData && data.responseData.length > 0
            ? data.responseData.find((p) => p.id == id)
            : data.responseData
        );

        // lấy list portfolios
        const portfolios = await fetch("/api/v1/portfolios", {
          headers: {
            // Authorization: `Bearer ${token}`,
          },
        });
        if (!portfolios.ok) {
          // throw new Error("Không thể lấy thông tin portfolios");
        } else {
          const portfoliosList = await portfolios?.json();
          const portfoliosListByPhotographer =
            portfoliosList?.responseData.filter((p) => p.photographerId == id);

          setPortfolios(
            portfoliosListByPhotographer?.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            ) || []
          );
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPhotographer();
  }, [id]);
  // get reviews
  useEffect(() => {
    async function fetchReviews() {
      try {
        const token = localStorage.getItem("user_token"); // hoặc admin_token nếu là admin
        const res = await fetch(`/api/v1/feedbacks/photographer/${id}`, {
          headers: {},
        });
        if (!res.ok) throw new Error("Can not get reviews");
        const data = await res.json();
        setReviews(data?.responseData || []);
        setBookingHasReview(data?.responseData.map((r) => r.bookingId) || []);
      } catch (e) {
        // Có thể setError nếu muốn
      }
    }
    if (id) fetchReviews();
  }, [id]);

  useEffect(() => {
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
          // setError("You are not authenticated. Please log in to continue.");

          return;
        }
        const data = await res.json();
        const allMyBookings = (data.responseData || []).filter((b) => {
          return (
            b.status != "REJECTED" && // loai bo cac booking bi tu choi
            b.photographerId == id && // chi lay booking cua photographer hien tai
            !bookingHasReview.includes(b.id) // loai bo cac booking da review roi
          );
        });
        console.log(bookingHasReview, allMyBookings);

        if (allMyBookings.length === 0) {
          return setBookings([]);
        } else {
          setBookings(
            allMyBookings.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            ) || []
          );
        }
        setIsAuthenticated(true);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, [id, bookingHasReview]);
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewBookingId || !reviewComment) {
      alert("Please select booking and enter comment!");
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem("user_token");
      const res = await fetch("/api/v1/feedbacks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          requestTrace: crypto.randomUUID(),
          requestDateTime: new Date().toISOString(),
          requestParameters: {
            bookingId: reviewBookingId,
            rating: Number(reviewRating),
            comment: reviewComment,
          },
        }),
      });
      if (!res.ok) throw new Error("Failed to submit review");
      setReviewComment("");
      setReviewBookingId("");
      setReviewRating(5);
      // Reload reviews
      const data = await res.json();
      // alert("Review submitted!");
      setReviews((prev) => [...prev, data.responseData]);
      // Optionally reload reviews here
      // window.location.reload();
      setBookingHasReview((prev) => [...prev, data.responseData.bookingId]);
      // reload reviews

      async function fetchReviews() {
        try {
          const token = localStorage.getItem("user_token"); // hoặc admin_token nếu là admin
          const res = await fetch(`/api/v1/feedbacks/photographer/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!res.ok) throw new Error("Can not get reviews");
          const data = await res.json();
          setReviews(data?.responseData || []);
          setBookingHasReview(data?.responseData.map((r) => r.bookingId) || []);
        } catch (e) {}
      }
      if (id) fetchReviews();
    } catch (err) {
      // alert("Submit review failed!");
      setSubmitError(err.message);
      //
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="content">
      <div className="container">
        <div className="row" style={{ marginTop: "50px" }}>
          <div className="col-md-12">
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className="text-danger">{error}</div>
            ) : !photographer ? (
              <div className="alert alert-danger mt-5">
                Photographer not found.
              </div>
            ) : (
              <div className="profile-header">
                <div className="row align-items-center">
                  <div className="col-auto profile-image">
                    <a href="#">
                      <img
                        src={
                          photographer.avatarUrl ||
                          "/theme/assets/img/doctor-grid/doctor-grid-02.jpg"
                        }
                        className="rounded-circle"
                        alt="Profile"
                        style={{ width: 200 }}
                      />
                    </a>
                  </div>
                  <div className="col ml-md-n2 profile-user-info">
                    <h4 className="user-name mb-0">
                      {photographer.businessName || `Photographer ${id}`}
                    </h4>
                    <p className="text-muted mb-1">
                      {photographer.speciality || "-"}
                    </p>
                    <p className="text-muted mb-1">
                      {photographer.languages?.join(", ") || "Vietnamese"}
                    </p>

                    <div className="rating">
                      <span className="d-inline-block average-rating">
                        <b> {photographer.yearsExperience}</b>
                      </span>
                      <span> Years of Experience </span> |{" "}
                      <span className="d-inline-block average-rating">
                        {(() => {
                          const rating = photographer.averageRating || 5;
                          const fullStars =
                            rating % 1 >= 0.75
                              ? Math.ceil(rating)
                              : Math.floor(rating);
                          const decimal = rating - Math.floor(rating);
                          const showHalf = decimal >= 0.25 && decimal < 0.75;
                          let stars = [];
                          for (
                            let i = 0;
                            i < (showHalf ? fullStars : Math.round(rating));
                            i++
                          ) {
                            stars.push(
                              <i key={i} className="fa fa-star text-warning" />
                            );
                          }
                          if (showHalf) {
                            stars.push(
                              <i
                                key="half"
                                className="fa fa-star-half-o text-warning"
                              />
                            );
                          }
                          for (let i = stars.length; i < 5; i++) {
                            stars.push(
                              <i
                                key={"empty" + i}
                                className="fa fa-star-o text-warning"
                              />
                            );
                          }
                          return stars;
                        })()}
                      </span>{" "}
                      |{" "}
                      <span className="d-inline-block average-rating">
                        with <b> {photographer.totalBookings}</b>
                      </span>
                      <span> bookings </span>
                    </div>
                    <div className="user-Location">
                      <i className="fa-solid fa-location-dot" />
                      {photographer.locationAddress || "-"}
                    </div>
                  </div>
                  <div className="col-auto profile-btn">
                    <Link href={`/booking/${id}`} className="btn btn-primary">
                      Book Appointment
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {photographer && (
          <>
            <div className="row">
              <div className="col-md-8">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">About</h5>
                    <p>{photographer.bio}</p>
                    <h5 className="card-title mt-4">Services</h5>
                    <div className="service-list">
                      {Array.isArray(photographer.specialties) &&
                      photographer.specialties.length > 0 ? (
                        photographer.specialties.map((item, idx) => (
                          <div className="service-item" key={idx}>
                            {item}
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="service-item">-</div>
                        </>
                      )}
                    </div>
                    <h5 className="card-title mt-4">Portfolio</h5>
                    <div className="row">
                      {portfolios.length === 0 && <p>Chưa có portfolio nào.</p>}
                      {portfolios.map((portfolio, index) => (
                        <a href={`/gallery/${portfolio.id}`} key={portfolio.id}>
                          <div className="col-md-4 mb-3" style={{}}>
                            {Array.isArray(portfolio.imageUrl) &&
                            portfolio.imageUrl.length > 0 ? (
                              <img
                                src={
                                  portfolio.imageUrl[0] ||
                                  "/theme/assets/img/blog/blog-37.jpg"
                                }
                                className="img-fluid rounded mb-2"
                                alt={portfolio.title || "Portfolio Image"}
                                style={{
                                  width: "100%",
                                  height: 150,
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <img
                                src="/theme/assets/img/blog/blog-37.jpg"
                                className="img-fluid rounded"
                                alt="Portfolio Image"
                                style={{
                                  width: "100%",
                                  height: 150,
                                  objectFit: "cover",
                                }}
                              />
                            )}
                            <br />
                            <p className="text-center">
                              {portfolio.title || "Untitled"}
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                {/* <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Address</h5>
                  <ul className="list-unstyled mb-0">
                    <li className="mt-2">
                      <i className="feather-map-pin me-2" />
                      {photographer.locationAddress +
                        ", " +
                        photographer.ward +
                        ", " +
                        photographer.city || "-"}
                    </li>
                  </ul>

                  <div className="mt-4">
                    <Link
                      href={`/booking/${id}`}
                      className="btn btn-primary w-100"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div> */}

                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Business Hours</h5>
                    <ul className="list-unstyled mb-0">
                      <li>Mon - Fri: 9:00 AM - 6:00 PM</li>
                      <li>Sat: 10:00 AM - 4:00 PM</li>
                      <li>Sun: Closed</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="doc-information-details" id="review">
              <div className="detail-title">
                <h4>Reviews ({reviews.length})</h4>
              </div>

              {reviews.map((review, index) => (
                <div className="doc-review-card" key={index}>
                  <div className="user-info-review">
                    <div className="reviewer-img">
                      <div className="review-star">
                        <a href="#">{review.customerName}</a>
                        <div className="rating">
                          {[...Array(review.rating || 5)].map((_, i) => (
                            <i key={i} className="fa fa-star text-warning" />
                          ))}
                          <span> | {moment(review.createdAt).fromNow()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p>{review.comment}</p>
                </div>
              ))}
            </div>
            {/* tao form gui review*/}
            {/* neu user login thi co the gui review */}
            {/* check user login */}
            {isAuthenticated && userBookings.length > 0 && (
              <div className="doc-information-details" id="review">
                <form onSubmit={handleSubmitReview}>
                  <div className="mb-3">
                    <label htmlFor="reviewComment" className="form-label">
                      Leave a Review
                    </label>
                    <textarea
                      id="reviewComment"
                      className="form-control"
                      rows="4"
                      placeholder="Write your review here..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="reviewRating"
                      className="form-label"
                      value={reviewBookingId}
                      onChange={(e) => setReviewBookingId(e.target.value)}
                    >
                      Select Your Booking
                    </label>
                    <select
                      id="reviewBooking"
                      className="form-select"
                      value={reviewBookingId}
                      onChange={(e) => setReviewBookingId(e.target.value)}
                      required
                    >
                      {userBookings.length === 0 ? (
                        <option value="">
                          You have no bookings with this photographer
                        </option>
                      ) : (
                        <>
                          <option value="">
                            -- Select a booking to review --
                          </option>
                          {userBookings.map((b, index) => (
                            <option value={b.id} key={index}>
                              {b.bookingCode} -{" "}
                              {moment(b.date).format("DD/MM/YYYY")}{" "}
                              {moment(b.startTime, "HH:mm").format("hh:mm A")}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="reviewRating" className="form-label">
                      Rating
                    </label>

                    <select
                      id="reviewRating"
                      className="form-select"
                      value={reviewRating}
                      onChange={(e) => setReviewRating(e.target.value)}
                    >
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                  {submitError && (
                    <div className="alert alert-danger mt-3">{submitError}</div>
                  )}
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
