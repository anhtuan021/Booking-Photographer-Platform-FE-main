"use client";
import PhotographerCard from "../../src/shared/PhotographerCard";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchPage({ searchParams }) {
  const router = useRouter();

  // Query params ban đầu
  const initialKeyword = searchParams?.keyword || "";
  const initialMinPrice = searchParams?.minPrice || "";
  const initialYears = searchParams?.yearsExperience || "";

  // States form
  const [searchQ, setSearchQ] = useState(initialKeyword);
  const [searchMinPrice, setSearchMinPrice] = useState(initialMinPrice);
  const [searchYearsExperience, setSearchYearsExperience] =
    useState(initialYears);

  // Data
  const [photographers, setPhotographers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [visibleCount, setVisibleCount] = useState(8);

  // Sync state nếu searchParams thay đổi (user sửa URL)
  useEffect(() => {
    setSearchQ(initialKeyword);
    setSearchMinPrice(initialMinPrice);
    setSearchYearsExperience(initialYears);
  }, [initialKeyword, initialMinPrice, initialYears]);

  // Helpers
  function getConsultationFees() {
    const fees = [];
    for (let i = 500000; i <= 5000000; i += 50000) fees.push(i);
    return fees[Math.floor(Math.random() * fees.length)];
  }
  function getRandomImage() {
    const num = Math.floor(Math.random() * 12) + 1;
    return `theme/assets/img/doctor-grid/doctor-grid-${String(num).padStart(
      2,
      "0"
    )}.jpg`;
  }

  // Fetch initial (toàn bộ hoặc theo params hiện tại)
  useEffect(() => {
    const params = new URLSearchParams();
    if (initialKeyword) params.append("keyword", initialKeyword);
    if (initialMinPrice) params.append("minPrice", initialMinPrice);
    if (initialYears) params.append("yearsExperience", initialYears);

    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const url =
          params.toString().length > 0
            ? `/api/v1/photographers/search?${params.toString()}`
            : `/api/v1/photographers/search`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Connection to server failed.");
        const data = await res.json();
        const arr = (data?.responseData || [])
          .filter((p) => p.status != "INACTIVE")
          .map((p) => ({
            ...p,
            minPrice: p.minPrice || getConsultationFees(),
            randomImage: getRandomImage(),
          }));
        setPhotographers(arr);
        setVisibleCount(8);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []); // chạy 1 lần đầu

  // Handle search submit
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (searchQ) params.append("keyword", searchQ);
      if (searchMinPrice) params.append("minPrice", searchMinPrice);
      if (searchYearsExperience)
        params.append("yearsExperience", searchYearsExperience);

      const url =
        params.toString().length > 0
          ? `/api/v1/photographers/search?${params.toString()}`
          : `/api/v1/photographers/search`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Cannot fetch photographers");
      const data = await res.json();
      const arr = (data?.responseData || [])
        .filter((p) => p.status != "INACTIVE")
        .map((p) => ({
          ...p,
          minPrice: p.minPrice || getConsultationFees(),
          randomImage: getRandomImage(),
        }));
      setPhotographers(arr);
      setVisibleCount(8);
      router.push(`/search?${params.toString()}`, { scroll: false });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Sort
  const sortedPhotographers = [...photographers].sort((a, b) => {
    const feeA = a.minPrice || 0;
    const feeB = b.minPrice || 0;
    return sortOrder === "asc" ? feeA - feeB : feeB - feeA;
  });

  // Load more slice
  const visiblePhotographers = sortedPhotographers.slice(0, visibleCount);

  const handleSortClick = (e) => {
    e.preventDefault();
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };
  const handleLoadMore = (e) => {
    e.preventDefault();
    setVisibleCount((v) => Math.min(v + 8, sortedPhotographers.length));
  };

  return (
    <>
      <div className="breadcrumb-bar overflow-visible">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <h2 className="breadcrumb-title">Search Photographers</h2>
              </nav>
            </div>
          </div>
          <div className="bg-primary-gradient rounded-pill doctors-search-box">
            <div
              className="search-box-one rounded-pill"
              style={{ width: "100%" }}
            >
              <form onSubmit={handleSearch}>
                <div
                  className="search-input search-line"
                  style={{ width: "55%" }}
                >
                  <i className="isax isax-hospital5 bficon"></i>
                  <div className="mb-0">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search Photographers Name, Address, Bio..."
                      value={searchQ}
                      onChange={(e) => setSearchQ(e.target.value)}
                    />
                  </div>
                </div>
                {/* <div className="search-input search-map-line">
                  <i className="isax isax-money-25"></i>
                  <div className="mb-0">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Min Price"
                      value={searchMinPrice}
                      onChange={(e) => setSearchMinPrice(e.target.value)}
                      min={0}
                    />
                  </div>
                </div>
                */}
                <div
                  className="search-input search-calendar-line"
                  style={{ width: "30%" }}
                >
                  <i className="isax isax-calendar-tick5"></i>
                  <div className="mb-0">
                    <input
                      name="yearsExperience"
                      type="number"
                      min={0}
                      className="form-control"
                      placeholder="Years of Experience"
                      value={searchYearsExperience}
                      onChange={(e) => setSearchYearsExperience(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-search-btn">
                  <button
                    className="btn btn-primary d-inline-flex align-items-center rounded-pill"
                    type="submit"
                    disabled={loading}
                  >
                    <i className="isax isax-search-normal-15 me-2"></i>
                    {loading ? "Searching..." : "Search"}
                  </button>
                </div>
              </form>
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

      <div className="content mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="mb-4">
                <h3>
                  {error ? (
                    <div className="text-danger">{error}</div>
                  ) : photographers.length === 0 ? (
                    <div>Not Found Photographers.</div>
                  ) : (
                    <div>
                      Showing{" "}
                      <span className="text-secondary">
                        {photographers.length}
                      </span>{" "}
                      Photographers For You
                    </div>
                  )}
                </h3>
              </div>
            </div>
            <div className="col-md-6">
              {!loading && !error && photographers.length > 0 && (
                <div className="d-flex align-items-center justify-content-end mb-4">
                  <div className="dropdown header-dropdown">
                    <a
                      className="dropdown-toggle sort-dropdown"
                      href="#"
                      onClick={handleSortClick}
                    >
                      <span>Sort By</span>
                      {sortOrder === "asc"
                        ? " Price (Low to High)"
                        : " Price (High to Low)"}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="row">
            {!loading &&
              !error &&
              visiblePhotographers.map((p) => (
                <div className="col-xxl-3 col-lg-4 col-md-6" key={p.id}>
                  <PhotographerCard photographer={p} />
                </div>
              ))}
            {loading && <div className="px-3">Loading...</div>}
            {error && <div className="text-danger px-3">{error}</div>}
            {/* {!loading && !error && photographers.length === 0 && (
              <div className="px-3">No photographers.</div>
            )} */}
            {!loading && !error && photographers.length > 0 && (
              <div className="text-center mb-4 w-100">
                <button
                  className="btn btn-md btn-primary-gradient d-inline-flex align-items-center rounded-pill"
                  onClick={handleLoadMore}
                  disabled={visibleCount >= sortedPhotographers.length}
                >
                  <i className="isax isax-d-cube-scan5 me-2"></i>
                  {visibleCount >= sortedPhotographers.length
                    ? "No More"
                    : "Load More Photographers"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
