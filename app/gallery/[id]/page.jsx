"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function GalleryDetailPage() {
  const { id } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [photographers, setPhotographers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPortfolio() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/v1/portfolios`);
        if (!res.ok) throw new Error("Không thể lấy thông tin portfolio");
        const data = await res.json();
        const portfolioInfo = data.responseData.find((p) => p.id == id);
        setPortfolio(portfolioInfo);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchPortfolio();
  }, [id]);
  useEffect(() => {
    async function fetchPhotographer() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `/api/v1/photographers/search?id=${portfolio?.photographerId}`
        );
        if (!res.ok) throw new Error("Không thể lấy thông tin photographer");
        const data = await res.json();
        setPhotographers(
          data?.responseData && data?.responseData.length > 0
            ? data.responseData[0]
            : null
        );
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    if (portfolio?.photographerId) fetchPhotographer();
  }, [portfolio?.photographerId]);

  const getRandomBlogImage = () => {
    const num = Math.floor(Math.random() * 12) + 1;
    const paddedNum = num < 10 ? `0${num}` : num;
    // return `/theme/assets/img/blog/blog-list-${paddedNum}.jpg`;
    return `/theme/assets/img/blog/blog-list-01.jpg`;
  };

  return (
    <>
      <div class="breadcrumb-bar">
        <div class="container">
          <div class="row align-items-center inner-banner">
            <div class="col-md-12 col-12 text-center">
              <nav aria-label="breadcrumb" class="page-breadcrumb">
                <h2 class="breadcrumb-title">Portfolio Details</h2>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div class="content">
        <div class="container">
          <div class="row">
            <div class="col-lg-8 col-md-12">
              {loading ? (
                <div>Đang tải...</div>
              ) : error ? (
                <div className="text-danger">{error}</div>
              ) : (
                <div class="blog-view">
                  {/* <h3 class="mb-3">{portfolio.title}</h3> */}
                  <div class="blog blog-single-post">
                    <div class="blog-image">
                      <a href="#">
                        <img
                          alt="blog-image"
                          src={
                            Array.isArray(portfolio?.imageUrl)
                              ? portfolio?.imageUrl[0] || getRandomBlogImage()
                              : portfolio?.imageUrl || getRandomBlogImage()
                          }
                          class="img-fluid"
                        />
                      </a>
                    </div>
                    <div class="blog-info d-md-flex align-items-center justify-content-between flex-wrap">
                      <div class="post-left">
                        <ul>
                          <li>
                            <span class="badge badge-dark fs-14 fw-medium">
                              {portfolio?.category || "-"}
                            </span>
                          </li>
                          <li>
                            <i class="isax isax-calendar"></i>
                            {portfolio?.createdAt
                              ? new Date(portfolio.createdAt)
                                  .toLocaleDateString("en-GB") // dd/mm/yyyy
                                  .replace(/\//g, "-")
                              : ""}
                          </li>
                          <li>
                            <div class="post-author">
                              <a href="#">
                                <span>{portfolio?.title}</span>
                              </a>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div class="blog-views d-flex align-items-center justify-content-md-end">
                        <span class="badge badge-outline-dark me-2">
                          <i class="isax isax-message-text me-1"></i>25
                        </span>
                        <span class="badge badge-outline-primary">
                          <i class="isax isax-eye me-1"></i>90
                        </span>
                      </div>
                    </div>
                    <div class="blog-content">
                      <p>
                        {portfolio?.description || "No description available."}
                      </p>
                      <div class="blog-image">
                        {Array.isArray(portfolio?.imageUrl) &&
                        portfolio.imageUrl.length > 1 ? (
                          portfolio.imageUrl.slice(1).map((img, idx) => (
                            <a href="#" key={idx}>
                              <img
                                alt="blog-image"
                                src={img || getRandomBlogImage()}
                                class="img-fluid"
                                style={{
                                  marginBottom: 12,
                                }}
                              />
                            </a>
                          ))
                        ) : (
                          <a href="#">
                            <img
                              alt="blog-image"
                              src={getRandomBlogImage()}
                              class="img-fluid"
                            />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <h4 class="mb-3">About Author</h4>
                  <div class="about-author">
                    <div class="about-author-img">
                      <div class="author-img-wrap">
                        <a href={`/photographer/${photographers?.id}`}>
                          <img
                            class="img-fluid"
                            alt="Darren Elder"
                            src={
                              photographers?.avatarUrl ||
                              "/theme/assets/img/clients/client-01.jpg"
                            }
                          />
                        </a>
                      </div>
                    </div>
                    <div class="author-details">
                      <p class="mb-0">
                        Name:{" "}
                        <strong>{photographers?.businessName || "-"}</strong>
                      </p>
                      <p class="mb-0">Bio: {photographers?.bio || "-"}</p>
                      <p class="mb-0">Email: {photographers?.email || "-"}</p>
                      <p class="mb-0">
                        Experience: {photographers?.yearsExperience || 0}{" "}
                        year(s)
                      </p>
                    </div>
                  </div>
                  <h4 class="mb-3">Specialties</h4>
                  <div className="d-flex align-items-center flex-wrap blog-tags gap-3 mb-4">
                    {Array.isArray(photographers?.specialties) &&
                    photographers.specialties.length > 0 ? (
                      photographers.specialties.map((spec, idx) => (
                        <span key={idx} className="badge bg-primary">
                          {spec}
                        </span>
                      ))
                    ) : (
                      <span className="badge bg-secondary">No specialties</span>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div class="col-lg-4 col-md-12 sidebar-right theiaStickySidebar">
              <div
                className="col-auto profile-btn"
                style={{ marginBottom: 12, width: "100%" }}
              >
                <Link
                  href={`/booking/${portfolio?.photographerId}`}
                  className="btn btn-primary"
                  style={{ width: "100%" }}
                >
                  Book Appointment
                </Link>
              </div>
              <div class="card category-widget">
                <div class="card-body">
                  <h5 class="mb-3">Categories</h5>
                  <ul class="categories">
                    <li>
                      <a href="#">
                        Fashion Care <span>(2)</span>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        Nutritions <span>(4)</span>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        Fashion Tips <span>(5)</span>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        Medical Research <span>(4)</span>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        Fashion Event <span>(6)</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="card tags-widget">
                <div class="card-body">
                  <h5 class="mb-3">Tags</h5>
                  <ul class="tags">
                    <li>
                      <a href="#" class="tag">
                        Fashion Tips
                      </a>
                    </li>
                    <li>
                      <a href="#" class="tag">
                        Wedding
                      </a>
                    </li>
                    <li>
                      <a href="#" class="tag">
                        Fashion
                      </a>
                    </li>
                    <li>
                      <a href="#" class="tag">
                        Portrail
                      </a>
                    </li>
                    <li>
                      <a href="#" class="tag">
                        Event
                      </a>
                    </li>
                    <li>
                      <a href="#" class="tag">
                        Fine Art
                      </a>
                    </li>
                    <li>
                      <a href="#" class="tag">
                        Landscape
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
