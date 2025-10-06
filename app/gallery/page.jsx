"use client";
import React, { useEffect, useState } from "react";

export default function CollectionsPage() {
  const [portfolios, setPortfolios] = useState([]);
  const [photographers, setPhotographers] = useState(null);
  const [visibleCount, setVisibleCount] = useState(4);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPortfolios() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("user_token");
        const res = await fetch("/api/v1/portfolios", {
          headers: {
            // Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Không thể lấy danh sách portfolios");
        const data = await res.json();
        setPortfolios(
          data.responseData.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          ) || []
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPortfolios();
  }, []);
  useEffect(() => {
    async function fetchPhotographer() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/v1/photographers/search`);
        if (!res.ok) throw new Error("Không thể lấy thông tin photographer");
        const data = await res.json();
        setPhotographers(data.responseData);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPhotographer();
  }, []);

  const getRandomBlogImage = () => {
    const num = Math.floor(Math.random() * 12) + 1;
    const paddedNum = num < 10 ? `0${num}` : num;
    return `/theme/assets/img/blog/doctor-grid-${paddedNum}.jpg`;
  };
  const handleLoadMore = (e) => {
    e.preventDefault();
    setVisibleCount((prev) => prev + 4);
  };
  const latestCollections = [...portfolios]
    .filter((item) => item.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const visiblePortfolios = portfolios.slice(0, visibleCount);
  const hasMore = visibleCount < portfolios.length;

  return (
    <>
      <div className="breadcrumb-bar">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <h2 className="breadcrumb-title">All Portfolios</h2>
              </nav>
            </div>
          </div>
        </div>
        <div className="breadcrumb-bg">
          <img
            src="/theme/assets/img/bg/breadcrumb-bg-01.png"
            alt="img"
            className="breadcrumb-bg-01"
          />
          <img
            src="/theme/assets/img/bg/breadcrumb-bg-02.png"
            alt="img"
            className="breadcrumb-bg-02"
          />
          <img
            src="/theme/assets/img/bg/breadcrumb-icon.png"
            alt="img"
            className="breadcrumb-bg-03"
          />
          <img
            src="/theme/assets/img/bg/breadcrumb-icon.png"
            alt="img"
            className="breadcrumb-bg-04"
          />
        </div>
      </div>

      {/* Page Content */}
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-12">
              {loading ? (
                <div>Đang tải...</div>
              ) : error ? (
                <div className="text-danger">{error}</div>
              ) : (
                <div className="row blog-grid-row">
                  {visiblePortfolios.map((item) => (
                    <div className="col-md-6 col-sm-12">
                      <div className="blog grid-blog">
                        <div className="blog-image">
                          <a href={`./gallery/${item.id}`}>
                            <img
                              className="img-fluid"
                              src={
                                Array.isArray(item.imageUrl)
                                  ? item.imageUrl[0] || getRandomBlogImage()
                                  : item.imageUrl || getRandomBlogImage()
                              }
                              alt={item.title}
                            />
                          </a>
                          <span className="badge badge-cyan category-slug">
                            {item.category || "Portrait"}
                          </span>
                        </div>
                        <div className="blog-content">
                          <ul className="entry-meta meta-item">
                            <li>
                              <div className="post-author">
                                <a
                                  href={`/photographer/${item.photographerId}`}
                                >
                                  <img
                                    src={
                                      photographers?.find(
                                        (p) => p.id === item.photographerId
                                      )?.imageUrl ||
                                      "/theme/assets/img/clients/client-01.jpg"
                                    }
                                    alt={
                                      photographers?.find(
                                        (p) => p.id === item.photographerId
                                      )?.businessName
                                    }
                                  />{" "}
                                  <span>
                                    {photographers?.find(
                                      (p) => p.id === item.photographerId
                                    )?.businessName ||
                                      "Photographer " + item.photographerId}
                                  </span>
                                </a>
                              </div>
                            </li>
                            <li>
                              <i className="isax isax-calendar-1" />{" "}
                              {item.createdAt
                                ? new Date(item.createdAt).toLocaleDateString()
                                : ""}
                            </li>
                            <li>
                              <a
                                href={`/booking/${item.photographerId}`}
                                className="btn btn-md btn-dark d-inline-flex align-items-center rounded-pill"
                              >
                                <i className="isax isax-calendar-1 me-2"></i>
                                Book Now
                              </a>
                            </li>
                          </ul>
                          <h3 className="blog-title">
                            <a href={`/gallery/${item.id}`}>{item.title}</a>
                          </h3>
                          <p className="mb-0">
                            {item.description ||
                              "Beautiful golden-hour portraits taken on location."}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="row">
                <div className="col-md-12">
                  <div className="pagination dashboard-pagination mt-md-3 mt-0 mb-4 d-flex justify-content-end">
                    <ul>
                      {hasMore && (
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleLoadMore}
                        >
                          Load More
                        </button>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4 col-md-12 sidebar-right theiaStickySidebar">
              <div className="card post-widget">
                <div className="card-body">
                  <h5 className="mb-3">Latest Collections</h5>
                  <ul className="latest-posts">
                    {latestCollections.map((item) => (
                      <li key={item.id}>
                        <div className="post-thumb">
                          <a href={`/gallery/${item.id}`}>
                            <img
                              src={
                                Array.isArray(item.imageUrl)
                                  ? item.imageUrl[0] || getRandomBlogImage()
                                  : item.imageUrl || getRandomBlogImage()
                              }
                              alt={item.title}
                            />
                          </a>
                        </div>
                        <div className="post-info">
                          <h5>
                            <a href={`/gallery/${item.id}`}>{item.title}</a>
                          </h5>
                          <span>
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString()
                              : ""}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="card category-widget">
                <div className="card-body">
                  <h5 className="mb-3">Categories</h5>
                  <ul className="categories">
                    <li>
                      <a href="#">
                        Portrait <span>(2)</span>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        Wedding <span>(4)</span>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        Lifestyle <span>(5)</span>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        Studio <span>(4)</span>
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
