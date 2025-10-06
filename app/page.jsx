"use client";
import Link from "next/link";
import DatepickerInit from "../src/components/DatepickerInit";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [price, setPrice] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const handleSearch = (e) => {
    e.preventDefault();
    // Tạo query string
    const params = new URLSearchParams();
    if (q) params.append("keyword", q);
    if (price) params.append("minPrice", price);
    if (yearsExperience) params.append("yearsExperience", yearsExperience);

    router.push(`/search?${params.toString()}`);
  };

  return (
    <>
      <DatepickerInit />
      <section className="banner-section banner-sec-one">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="banner-content">
                <div className="rating-appointment d-inline-flex align-items-center gap-2">
                  <div className="avatar-list-stacked avatar-group-lg">
                    <span className="avatar avatar-rounded">
                      <img
                        className="border border-white"
                        src="/theme/assets/img/doctors/doctor-thumb-22.jpg"
                        alt="img"
                      />
                    </span>
                    <span className="avatar avatar-rounded">
                      <img
                        className="border border-white"
                        src="/theme/assets/img/doctors/doctor-thumb-23.jpg"
                        alt="img"
                      />
                    </span>
                    <span className="avatar avatar-rounded">
                      <img
                        src="/theme/assets/img/doctors/doctor-thumb-24.jpg"
                        alt="img"
                      />
                    </span>
                  </div>
                  <div className="me-2">
                    <h6 className="mb-1">500+ Appointments</h6>
                    <div className="d-flex align-items-center">
                      <div className="d-flex align-items-center">
                        <i className="fa-solid fa-star text-orange me-1"></i>
                        <i className="fa-solid fa-star text-orange me-1"></i>
                        <i className="fa-solid fa-star text-orange me-1"></i>
                        <i className="fa-solid fa-star text-orange me-1"></i>
                        <i className="fa-solid fa-star text-orange me-1"></i>
                      </div>
                      <p>5.0 Ratings</p>
                    </div>
                  </div>
                </div>
                <h1 className="display-5">
                  Discover Photography: Capture Your Trusted{" "}
                  <span className="banner-icon">
                    <img src="/theme/assets/img/icons/video.svg" alt="img" />
                  </span>{" "}
                  <span className="text-gradient"> Moments</span> Today
                </h1>
                <div className="search-box-one" style={{ width: "100%" }}>
                  <form onSubmit={handleSearch}>
                    <div
                      className="search-input search-line"
                      style={{ width: "55%" }}
                    >
                      <i className="isax isax-hospital5 bficon"></i>
                      <div className=" mb-0">
                        <input
                          name="q"
                          type="text"
                          className="form-control"
                          placeholder="Search Photographers Name, Address, Bio..."
                          value={q}
                          onChange={(e) => setQ(e.target.value)}
                        />
                      </div>
                    </div>
                    {/* <div className="search-input search-map-line">
                      <i className="isax isax-money-25"></i>
                      <div className=" mb-0">
                        <input
                          name="price"
                          type="text"
                          className="form-control"
                          placeholder="Min Price"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                      </div>
                    </div>
                    */}
                    <div
                      className="search-input search-calendar-line"
                      style={{ width: "30%" }}
                    >
                      <i className="isax isax-calendar-tick5"></i>
                      <div className=" mb-0">
                        <input
                          name="yearsExperience"
                          type="number"
                          className="form-control"
                          placeholder="Years of Experience"
                          value={yearsExperience}
                          onChange={(e) => setYearsExperience(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-search-btn">
                      <button className="btn btn-primary" type="submit">
                        Search
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="banner-img">
                <img
                  src="/theme/assets/img/banner/doctor-banner.png"
                  className="img-fluid"
                  alt="banner"
                />
                <div className="banner-appointment">
                  <h6>1K</h6>
                  <p>
                    Appointments <span className="d-block">Completed</span>
                  </p>
                </div>
                <div className="banner-patient">
                  <div className="avatar-list-stacked avatar-group-sm">
                    <span className="avatar avatar-rounded">
                      <img
                        src="/theme/assets/img/patients/patient19.jpg"
                        alt="img"
                      />
                    </span>
                    <span className="avatar avatar-rounded">
                      <img
                        src="/theme/assets/img/patients/patient16.jpg"
                        alt="img"
                      />
                    </span>
                    <span className="avatar avatar-rounded">
                      <img
                        src="/theme/assets/img/patients/patient18.jpg"
                        alt="img"
                      />
                    </span>
                  </div>
                  <p>15K+</p>
                  <p>Satisfied Customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="list-section">
        <div className="container">
          <div className="list-card card mb-0">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-center justify-content-xl-between flex-wrap gap-4 list-wraps">
                <a href="/booking" className="list-item">
                  <div className="list-icon bg-secondary">
                    <img
                      src="/theme/assets/img/icons/list-icon-01.svg"
                      alt="img"
                    />
                  </div>
                  <h6>Book Appointment</h6>
                </a>
                <a href="/gallery" className="list-item">
                  <div className="list-icon bg-pink">
                    <img
                      src="/theme/assets/img/icons/list-icon-03.svg"
                      alt="img"
                    />
                  </div>
                  <h6>Portfolios</h6>
                </a>

                <a href="/search" className="list-item">
                  <div className="list-icon bg-primary">
                    <img
                      src="/theme/assets/img/icons/list-icon-02.svg"
                      alt="img"
                    />
                  </div>
                  <h6>View Photographers</h6>
                </a>
                <a href="/" className="list-item">
                  <div className="list-icon bg-pink">
                    <img
                      src="/theme/assets/img/icons/list-icon-06.svg"
                      alt="img"
                    />
                  </div>
                  <h6>Manage Bookings</h6>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="reason-section">
        <div className="container">
          <div
            className="section-header sec-header-one text-center aos"
            data-aos="fade-up"
          >
            <span className="badge badge-primary">Why Book With Us</span>
            <h2>Compelling Reasons to Choose</h2>
          </div>
          <div className="row row-gap-4 justify-content-center">
            <div className="col-lg-4 col-md-6">
              <div className="reason-item aos" data-aos="fade-up">
                <h6 className="mb-2 d-flex align-items-center">
                  <i className="isax isax-tag-user5 text-orange me-2"></i>
                  Follow-Up Care
                </h6>
                <p className="fs-14 mb-0">
                  We ensure continuity of care through regular follow-ups and
                  communication, helping you stay on track with health goals.
                </p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="reason-item aos" data-aos="fade-up">
                <h6 className="mb-2 d-flex align-items-center">
                  <i className="isax isax-voice-cricle text-purple me-2"></i>
                  Patient-Centered Approach
                </h6>
                <p className="fs-14 mb-0">
                  We prioritize your comfort and preferences, tailoring our
                  services to meet your individual needs and Care from Our
                  Experts
                </p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="reason-item aos" data-aos="fade-up">
                <h6 className="mb-2 d-flex align-items-center">
                  <i className="isax isax-wallet-add-15 text-cyan me-2"></i>
                  Convenient Access
                </h6>
                <p className="fs-14 mb-0">
                  Easily book appointments online or through our dedicated
                  customer service team, with flexible hours to fit your
                  schedule.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bookus-section bg-dark">
        <div className="container">
          <div className="row align-items-center row-gap-4">
            <div className="col-lg-6">
              <div className="bookus-img">
                <div className="row g-3">
                  <div className="col-md-12 aos" data-aos="fade-up">
                    <img
                      src="theme/assets/img/book-01.jpg"
                      alt="img"
                      style={{ width: "100%" }}
                      className="img-fluid"
                    />
                  </div>
                  <div className="col-sm-6 aos" data-aos="fade-up">
                    <img
                      src="theme/assets/img/book-02.jpg"
                      alt="img"
                      className="img-fluid"
                    />
                  </div>
                  <div className="col-sm-6 aos" data-aos="fade-up">
                    <img
                      src="theme/assets/img/book-03.jpg"
                      alt="img"
                      className="img-fluid"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div
                className="section-header sec-header-one mb-2 aos"
                data-aos="fade-up"
              >
                <span className="badge badge-primary">Why Book With Us</span>
                <h2 className="text-white mb-3">
                  We are committed to understanding your{" "}
                  <span className="text-primary-gradient">
                    {" "}
                    unique vision and capturing it with care.
                  </span>
                </h2>
              </div>
              <p className="text-light mb-4">
                As a trusted photography partner in our community, we are
                passionate about celebrating life’s moments beyond the studio.
                We actively engage in community events, creative exhibitions,
                and educational workshops.
              </p>
              <div className="faq-info aos" data-aos="fade-up">
                <div className="accordion" id="faq-details">
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                      <a
                        href="javascript:void(0);"
                        className="accordion-button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseOne"
                        aria-expanded="true"
                        aria-controls="collapseOne"
                      >
                        01 . Our Vision
                      </a>
                    </h2>
                    <div
                      id="collapseOne"
                      className="accordion-collapse collapse show"
                      aria-labelledby="headingOne"
                      data-bs-parent="#faq-details"
                    >
                      <div className="accordion-body">
                        <div className="accordion-content">
                          <p>
                            We envision a community where everyone has access to
                            high-quality photography and the inspiration they
                            need to capture and cherish life’s most meaningful
                            moments
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingTwo">
                      <a
                        href="javascript:void(0);"
                        className="accordion-button collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseTwo"
                        aria-controls="collapseTwo"
                      >
                        02 . Our Mission
                      </a>
                    </h2>
                    <div
                      id="collapseTwo"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingTwo"
                      data-bs-parent="#faq-details"
                    >
                      <div className="accordion-body">
                        <div className="accordion-content">
                          <p>
                            Our mission is to make high-quality photography
                            accessible to everyone, empowering people to
                            capture, share, and treasure life’s most meaningful
                            moments.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bookus-sec">
            <div className="row g-4">
              <div className="col-lg-3">
                <div className="book-item">
                  <div className="book-icon bg-primary">
                    <i className="isax isax-search-normal5"></i>
                  </div>
                  <div className="book-info">
                    <h6 className="text-white mb-2">
                      Search For Photographers
                    </h6>
                    <p className="fs-14 text-light">
                      Easily search and connect with professional photographers
                      who match your unique style and needs.
                    </p>
                  </div>
                  <div className="way-icon">
                    <img src="theme/assets/img/icons/way-icon.svg" alt="img" />
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="book-item">
                  <div className="book-icon bg-orange">
                    <i className="isax isax-security-user5"></i>
                  </div>
                  <div className="book-info">
                    <h6 className="text-white mb-2">
                      Check Photographer Profile
                    </h6>
                    <p className="fs-14 text-light">
                      View detailed photographer profiles to explore their
                      portfolio, style, and experience.
                    </p>
                  </div>
                  <div className="way-icon">
                    <img src="theme/assets/img/icons/way-icon.svg" alt="img" />
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="book-item">
                  <div className="book-icon bg-cyan">
                    <i className="isax isax-calendar5"></i>
                  </div>
                  <div className="book-info">
                    <h6 className="text-white mb-2">Schedule Appointment</h6>
                    <p className="fs-14 text-light">
                      After choose your preferred photographer, select a
                      convenient time slot, & confirm your appointment.
                    </p>
                  </div>
                  <div className="way-icon">
                    <img src="theme/assets/img/icons/way-icon.svg" alt="img" />
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="book-item">
                  <div className="book-icon bg-indigo">
                    <i className="isax isax-blend5"></i>
                  </div>
                  <div className="book-info">
                    <h6 className="text-white mb-2">Get Your Solution</h6>
                    <p className="fs-14 text-light">
                      Receive tailored photography solutions designed to match
                      your unique needs and style.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
