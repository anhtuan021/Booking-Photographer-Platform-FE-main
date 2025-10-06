"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { da, vi } from "date-fns/locale";
import { v4 as uuidv4 } from "uuid";

import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import "./page.css";

import {
  SERVICE_DETAILS,
  SPECIALITY_SERVICES,
  TIME_SLOTS,
  DISCOUNT_PERCENTAGE,
} from "../../constants/common";
export default function BookingPage({ params }) {
  const { id } = params;
  const [speciality, setSpeciality] = useState("PORTRAIT");
  const [selectedServices, setSelectedServices] = useState([]); // index array
  const [serviceDetails, setServiceDetails] = useState([]); // index array
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(""); // Thêm state cho time slot
  const [photographer, setPhotographer] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(0); // Thêm state quản lý bước
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookingCode, setBookingCode] = useState(null);
  const [formError, setFormError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("user_token") : null;
  if (token && !isAuthenticated) {
    setIsAuthenticated(true);
  }
  const validateStep = (step) => {
    if (step === 1) {
      if (selectedServices.length === 0) {
        setFormError("Please select at least one service.");
        return false;
      }
    }
    if (step === 2) {
      if (!selectedDate || !selectedTimeSlot) {
        setFormError("Please select a date and time slot.");
        return false;
      }
    }
    if (step === 3) {
      if (
        !firstName.trim() ||
        !lastName.trim() ||
        !phone.trim() ||
        !email.trim()
      ) {
        setFormError("Please enter all personal information.");
        return false;
      }
      const phoneRegex = /^(0)\d{9}$/;
      if (!phoneRegex.test(phone.trim())) {
        setFormError("Phone number is not a valid.");
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setFormError("Email is not valid.");
        return false;
      }
    }
    setFormError("");
    return true;
  };

  // booking
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");

  // Tính tổng tiền cần thanh toán
  const getTotalPayment = () => {
    return selectedServices.reduce((total, code) => {
      const service =
        serviceDetails.find((s) => s.code === code) ||
        SPECIALITY_SERVICES.find((s) => s.code === code);

      return (
        total +
        (service?.price - ((service?.discount / 100) * service?.price || 0) ||
          0)
      );
    }, 0);
  };

  // no discount
  const getTotalPrice = () => {
    return selectedServices.reduce((total, code) => {
      const service =
        serviceDetails.find((s) => s.code === code) ||
        SPECIALITY_SERVICES.find((s) => s.code === code);

      return total + (service?.price || 0);
    }, 0);
  };
  // Lấy danh sách services theo specialty
  useEffect(() => {
    async function fetchPackages() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/v1/packages?isActive=true`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
          },
        });
        if (!res.ok) {
          if (res.status === 403) {
            setPackages([]);
            return;
          } else if (res.status === 401) {
            setPackages([]);
            setIsAuthenticated(false);
            // setError("You are not authenticated. Please log in to continue.");

            return;
          } else throw new Error("Cannot fetch packages");
        }
        const data = await res.json();

        if (data && data.responseData) {
          setPackages(data.responseData);
        } else {
          // throw new Error("Packages not found");
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPackages();
  }, []);

  useEffect(() => {
    const services =
      packages?.length > 0
        ? packages.filter((p) => p.speciality === speciality)
        : [];
    // : SERVICE_DETAILS[speciality] || [];

    setServiceDetails(
      services.map((p) => ({ ...p, price: p.basePrice || p.price || 0 }))
    );
  }, [packages, speciality]);

  // Khi đổi specialty
  const handleSpecialityChange = (e) => {
    setSpeciality(e.target.value);
    setSelectedServices([]);
  };
  const handleServiceToggle = (serviceCode) => {
    setSelectedServices((prev) =>
      prev.includes(serviceCode)
        ? prev.filter((c) => c !== serviceCode)
        : [...prev, serviceCode]
    );
    validateStep(currentStep);
  };
  const isServiceSelected = (code) => selectedServices.includes(code);

  // Khi chọn time slot
  const handleTimeSlotChange = (time) => {
    setSelectedTimeSlot(time);
    validateStep(currentStep);
  };
  const handleNextStep = (step) => {
    // Gom dữ liệu booking
    const bookingData = {
      photographerId: id,
      speciality,
      services: selectedServices,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      firstName,
      lastName,
      phone,
      email,
      note,
    };
    if (!validateStep(step)) return;
    setCurrentStep(step);
  };
  useEffect(() => {
    async function fetchPhotographer() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/v1/photographers/search?id=${id}`);
        if (!res.ok) throw new Error("Can not get photographer");
        const data = await res.json();

        if (data && data.responseData) {
          if (Array.isArray(data.responseData)) {
            const p = data.responseData.find((p) => p.id == id);
            if (!p) throw new Error("Photographer not found");
            setPhotographer({
              ...p,
              specialties:
                p.specialties == null || p.specialties.length === 0
                  ? ["PORTRAIT", "WEDDING", "EVENT", "STREET"]
                  : p.specialties,
            });
          } else {
            // Nếu responseData là object
            setPhotographer(data.responseData);
          }
        } else {
          throw new Error("Photographer not found");
        }
      } catch (e) {
        console.error("Error fetching photographer:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchPhotographer();
  }, [id]);

  // useEffect(() => {
  //   console.log("Photographer state updated:", photographer);
  // }, [photographer]);
  const resetBooking = () => {
    setCurrentStep(0);
    setSpeciality("PORTRAIT");
    setSelectedServices([]);
    setSelectedTimeSlot("");
    setSelectedDate(new Date());
    setFirstName("");
    setLastName("");
    setPhone("");
    setEmail("");
    setNote("");
  };
  const handleConfirmPaid = async () => {
    const bookingData = {
      photographerId: id,
      speciality,
      services: selectedServices,
      date: moment(selectedDate).format("DD-MM-YYYY").toString(),
      timeSlot: selectedTimeSlot,
      firstName,
      lastName,
      phone,
      email,
      note,
      price: getTotalPrice(),
      totalDiscount: getTotalPrice() - getTotalPayment(),
      totalPayment: getTotalPayment(),
    };
    if (!validateStep(4)) return;
    try {
      const res = await fetch("/api/v1/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
        body: JSON.stringify({
          requestTrace: uuidv4(),
          requestDateTime: moment().toISOString(),
          requestParameters: bookingData,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(
          data?.responseStatus?.responseMessage || "Booking failed!"
        );
      }
      // Nếu thành công, chuyển sang bước xác nhận
      const data = await res.json();

      setBookingCode(data?.responseData?.bookingCode || "N/A");
      let bookings = [];
      const userInfo = localStorage.getItem("user");

      // try {
      //   bookings =
      //     JSON.parse(localStorage.getItem(`myBookings_ID${userInfo.id}`)) || [];
      // } catch (e) {
      //   bookings = [];
      // }
      // bookings.push({
      //   ...bookingData,
      //   bookingCode: data?.responseData?.bookingCode || "N/A",
      //   photographer,
      // });
      // localStorage.setItem(
      //   `myBookings_ID${userInfo.id}`,
      //   JSON.stringify(bookings)
      // );

      setCurrentStep(4);
    } catch (e) {
      setFormError(e.message || "Booking failed");
    }
  };
  return (
    <div>
      <div className="doctor-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              {loading ? (
                <div>Loading...</div>
              ) : error ? (
                <div className="text-danger">{error}</div>
              ) : (
                <>
                  <div className="booking-wizard">
                    <ul
                      className="form-wizard-steps d-sm-flex align-items-center justify-content-center"
                      id="progressbar2"
                    >
                      <li
                        className={currentStep === 0 ? "progress-active" : ""}
                      >
                        <div className="profile-step">
                          <span className="multi-steps">1</span>
                          <div className="step-section">
                            <h6>Specialty</h6>
                          </div>
                        </div>
                      </li>

                      <li
                        className={currentStep === 1 ? "progress-active" : ""}
                      >
                        <div className="profile-step">
                          <span className="multi-steps">2</span>
                          <div className="step-section">
                            <h6>Date & Time</h6>
                          </div>
                        </div>
                      </li>
                      <li
                        className={currentStep === 2 ? "progress-active" : ""}
                      >
                        <div className="profile-step">
                          <span className="multi-steps">3</span>
                          <div className="step-section">
                            <h6>Basic Information</h6>
                          </div>
                        </div>
                      </li>
                      <li
                        className={currentStep === 3 ? "progress-active" : ""}
                      >
                        <div className="profile-step">
                          <span className="multi-steps">4</span>
                          <div className="step-section">
                            <h6>Payment</h6>
                          </div>
                        </div>
                      </li>
                      <li
                        className={currentStep === 4 ? "progress-active" : ""}
                      >
                        <div className="profile-step">
                          <span className="multi-steps">5</span>
                          <div className="step-section">
                            <h6>Confirmation</h6>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="booking-widget multistep-form mb-5">
                    <fieldset
                      id="first"
                      style={{ display: currentStep === 0 ? "block" : "none" }}
                    >
                      <div className="card booking-card mb-0">
                        <div className="card-header">
                          <div className="booking-header pb-0">
                            <div className="card mb-0">
                              <div className="card-body">
                                <div className="d-flex align-items-center flex-wrap rpw-gap-2 flex-wrap row-gap-2">
                                  <span className="avatar avatar-xxxl avatar-rounded me-2 flex-shrink-0">
                                    <img
                                      src={
                                        photographer?.avatarUrl ||
                                        "/theme/assets/img/clients/client-15.jpg"
                                      }
                                      alt=""
                                    />
                                  </span>
                                  <div>
                                    <h4 className="mb-1">
                                      <span className="badge bg-orange fs-12">
                                        <i className="fa-solid fa-star me-1"></i>
                                        {photographer?.averageRating || "5"}
                                      </span>{" "}
                                      {photographer?.businessName ||
                                        "Photographer " + photographer?.id}
                                    </h4>
                                    <p className="text-indigo mb-3 fw-medium">
                                      {photographer?.specialty || "-"}
                                    </p>
                                    <p className="mb-0">
                                      <i className="isax isax-location me-2"></i>
                                      {photographer?.locationAddress || "-"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card-body booking-body">
                          <div className="card mb-0">
                            <div className="card-body pb-1">
                              <div className="mb-4 pb-4 border-bottom">
                                <h6 className="mb-3">Select Speciality</h6>
                                <select
                                  name=""
                                  style={{
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    padding: "8px",
                                    width: "100%",
                                  }}
                                  value={speciality}
                                  onChange={handleSpecialityChange}
                                >
                                  {photographer?.specialties?.map((code) => {
                                    const spec = SPECIALITY_SERVICES.find(
                                      (s) => s.code === code
                                    );
                                    return (
                                      <option key={code} value={code}>
                                        {spec ? spec.name : code}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                              <h6 className="mb-3">Services</h6>
                              <div className="row">
                                {serviceDetails.map((service) => (
                                  <div
                                    className="col-lg-4 col-md-6"
                                    key={service.code}
                                    onClick={() =>
                                      handleServiceToggle(service.code)
                                    }
                                  >
                                    <div
                                      className={`service-item${
                                        isServiceSelected(service.code)
                                          ? " active"
                                          : ""
                                      }`}
                                    >
                                      <input
                                        className="form-check-input ms-0 mt-0"
                                        type="checkbox"
                                        id={`service-${service.code}`}
                                        value={service.code}
                                        checked={isServiceSelected(
                                          service.code
                                        )}
                                        onChange={() =>
                                          handleServiceToggle(service.code)
                                        }
                                      />
                                      <label
                                        className="form-check-label ms-2"
                                        htmlFor={`service-${service.code}`}
                                      >
                                        <span className="service-title d-block mb-1">
                                          {service.name}
                                        </span>
                                        {service.isPremium && (
                                          <span class="badge bg-success-light d-inline-flex align-items-center">
                                            <i class="fa-solid fa-circle fs-5 me-1"></i>
                                            Premium
                                          </span>
                                        )}
                                        <span
                                          className="fs-13 d-block"
                                          style={{
                                            color: "#888",
                                            margin: "0 0 5px 0",
                                          }}
                                        >
                                          {service.description}
                                        </span>
                                        <span className="fs-14 d-block">
                                          Price:{" "}
                                          <b>
                                            {service.price.toLocaleString(
                                              "vi-VN"
                                            )}
                                          </b>{" "}
                                          đ
                                        </span>
                                        {service.discount > 0 && (
                                          <span className="fs-14 d-block">
                                            Discount: <b>{service.discount}%</b>
                                          </span>
                                        )}
                                      </label>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {isAuthenticated === false ? (
                              <div className="alert alert-warning m-3">
                                <i
                                  className="fa fa-exclamation-circle"
                                  aria-hidden="true"
                                ></i>
                                &nbsp; Please login to booking
                              </div>
                            ) : null}
                            {formError && (
                              <div className="alert alert-danger m-3">
                                <i
                                  className="fa fa-exclamation-circle"
                                  aria-hidden="true"
                                ></i>{" "}
                                {formError}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="card-footer">
                          <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between">
                            <span className="inline-flex align-items-center"></span>
                            <a
                              href="#"
                              onClick={() => handleNextStep(1)}
                              className="btn btn-md btn-primary-gradient next_btns inline-flex align-items-center rounded-pill"
                            >
                              Select Date & Time
                              <i className="isax isax-arrow-right-3 ms-1"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                    <fieldset
                      style={{ display: currentStep === 1 ? "block" : "none" }}
                    >
                      <div className="card booking-card mb-0">
                        <div className="card-header">
                          <div className="booking-header pb-0">
                            <div className="card mb-0">
                              <div className="card-body">
                                <div className="d-flex align-items-center flex-wrap rpw-gap-2 flex-wrap row-gap-2">
                                  <span className="avatar avatar-xxxl avatar-rounded me-2 flex-shrink-0">
                                    <img
                                      src={
                                        photographer?.avatarUrl ||
                                        "/theme/assets/img/clients/client-15.jpg"
                                      }
                                      alt=""
                                    />
                                  </span>
                                  <div>
                                    <h4 className="mb-1">
                                      {photographer?.businessName ||
                                        photographer?.firstName +
                                          " " +
                                          photographer?.lastName ||
                                        "Unknown Photographer"}
                                      <span className="badge bg-orange fs-12">
                                        <i className="fa-solid fa-star me-1"></i>
                                        5.0
                                      </span>
                                    </h4>
                                    <p className="text-indigo mb-3 fw-medium">
                                      {photographer?.specialty || "-"}
                                    </p>
                                    <p className="mb-0">
                                      <i className="isax isax-location me-2"></i>
                                      {photographer?.locationAddress || "-"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card-body booking-body">
                          <div className="card mb-0">
                            <div className="card-body pb-1">
                              <div className="row">
                                <div className="col-lg-5">
                                  <div className="card">
                                    <div
                                      className="card-body p-2 pt-3 h-250"
                                      style={{ width: "100%" }}
                                    >
                                      {/* <div id="datetimepickershow"></div> */}
                                      <label htmlFor="booking-date">
                                        Booking Date
                                      </label>
                                      <br />
                                      <LocalizationProvider
                                        dateAdapter={AdapterDateFns}
                                        adapterLocale={vi}
                                      >
                                        <DatePicker
                                          value={selectedDate}
                                          onChange={(newValue) =>
                                            setSelectedDate(newValue)
                                          }
                                          slotProps={{
                                            textField: { fullWidth: true },
                                          }}
                                          disablePast
                                        />
                                      </LocalizationProvider>
                                      {/* <DatePicker
                                        selected={selectedDate}
                                        onChange={(date) =>
                                          setSelectedDate(date)
                                        }
                                        dateFormat="dd/MM/yyyy"
                                        minDate={new Date()}
                                        className="form-control"
                                        placeholderText="Select a date"
                                      /> */}
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-7">
                                  <div className="card booking-wizard-slots">
                                    <div className="card-body h-250">
                                      <div className="book-title">
                                        <h6 className="fs-14 mb-2">Morning</h6>
                                      </div>
                                      <div className="token-slot mt-2 mb-2">
                                        {TIME_SLOTS.morning.map((time, idx) => (
                                          <div
                                            className="form-check-inline visits me-1"
                                            key={time}
                                          >
                                            <label className="visit-btns">
                                              <input
                                                type="radio"
                                                className="form-check-input"
                                                name="timeSlot"
                                                value={time}
                                                checked={
                                                  selectedTimeSlot === time
                                                }
                                                onChange={() =>
                                                  handleTimeSlotChange(time)
                                                }
                                              />
                                              <span className="visit-rsn">
                                                {time}
                                              </span>
                                            </label>
                                          </div>
                                        ))}
                                      </div>
                                      <div className="book-title">
                                        <h6 className="fs-14 mb-2">
                                          Afternoon
                                        </h6>
                                      </div>
                                      <div className="token-slot mt-2 mb-2">
                                        {TIME_SLOTS.afternoon.map(
                                          (time, idx) => (
                                            <div
                                              className="form-check-inline visits me-1"
                                              key={time}
                                            >
                                              <label className="visit-btns">
                                                <input
                                                  type="radio"
                                                  className="form-check-input"
                                                  name="timeSlot"
                                                  value={time}
                                                  checked={
                                                    selectedTimeSlot === time
                                                  }
                                                  onChange={() =>
                                                    handleTimeSlotChange(time)
                                                  }
                                                />
                                                <span className="visit-rsn">
                                                  {time}
                                                </span>
                                              </label>
                                            </div>
                                          )
                                        )}
                                      </div>
                                      <div className="book-title">
                                        <h6 className="fs-14 mb-2">Evening</h6>
                                      </div>
                                      <div className="token-slot mt-2 mb-2">
                                        {TIME_SLOTS.evening.map((time, idx) => (
                                          <div
                                            className="form-check-inline visits me-1"
                                            key={time}
                                          >
                                            <label className="visit-btns">
                                              <input
                                                type="radio"
                                                className="form-check-input"
                                                name="timeSlot"
                                                value={time}
                                                checked={
                                                  selectedTimeSlot === time
                                                }
                                                onChange={() =>
                                                  handleTimeSlotChange(time)
                                                }
                                              />
                                              <span className="visit-rsn">
                                                {time}
                                              </span>
                                            </label>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {formError && (
                              <div className="alert alert-danger m-3">
                                <i
                                  class="fa fa-exclamation-circle"
                                  aria-hidden="true"
                                ></i>
                                &nbsp;
                                {formError}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="card-footer">
                          <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between">
                            <a
                              href="#"
                              onClick={() => setCurrentStep(0)}
                              className="btn btn-md btn-dark prev_btns inline-flex align-items-center rounded-pill"
                            >
                              <i className="isax isax-arrow-left-2 me-1"></i>
                              Back
                            </a>
                            <a
                              href="#"
                              onClick={() => handleNextStep(2)}
                              className="btn btn-md btn-primary-gradient next_btns inline-flex align-items-center rounded-pill"
                            >
                              Add Basic Information
                              <i className="isax isax-arrow-right-3 ms-1"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                    <fieldset
                      style={{ display: currentStep === 2 ? "block" : "none" }}
                    >
                      <div className="card booking-card mb-0">
                        <div className="card-header">
                          <div className="booking-header pb-0">
                            <div className="card mb-0">
                              <div className="card-body">
                                <div className="d-flex align-items-center flex-wrap rpw-gap-2 flex-wrap row-gap-2">
                                  <span className="avatar avatar-xxxl avatar-rounded me-2 flex-shrink-0">
                                    <img
                                      src={
                                        photographer?.avatarUrl ||
                                        "/theme/assets/img/clients/client-15.jpg"
                                      }
                                      alt=""
                                    />
                                  </span>
                                  <div>
                                    <h4 className="mb-1">
                                      {photographer?.businessName ||
                                        photographer?.firstName +
                                          " " +
                                          photographer?.lastName ||
                                        "Unknown Photographer"}
                                      <span className="badge bg-orange fs-12">
                                        <i className="fa-solid fa-star me-1"></i>
                                        5.0
                                      </span>
                                    </h4>
                                    <p className="text-indigo mb-3 fw-medium">
                                      {photographer?.specialty || "-"}
                                    </p>
                                    <p className="mb-0">
                                      <i className="isax isax-location me-2"></i>
                                      {photographer?.locationAddress || "-"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card-body booking-body">
                          <div className="card mb-0">
                            <div className="card-body pb-1">
                              <div className="row">
                                <div className="col-lg-6 col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label">
                                      First Name
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="Tran Ngoc"
                                      className="form-control"
                                      value={firstName}
                                      onChange={(e) => {
                                        setFirstName(e.target.value);
                                        if (
                                          e.target.value.trim() &&
                                          lastName.trim() &&
                                          phone.trim() &&
                                          email.trim()
                                        ) {
                                          setFormError("");
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Last Name
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="Anh"
                                      className="form-control"
                                      value={lastName}
                                      onChange={(e) => {
                                        setLastName(e.target.value);
                                        if (
                                          firstName.trim() &&
                                          e.target.value.trim() &&
                                          phone.trim() &&
                                          email.trim()
                                        ) {
                                          setFormError("");
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Phone Number
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="0123456789"
                                      className="form-control"
                                      value={phone}
                                      onChange={(e) => {
                                        setPhone(e.target.value);
                                        if (
                                          firstName.trim() &&
                                          lastName.trim() &&
                                          e.target.value.trim() &&
                                          email.trim()
                                        ) {
                                          setFormError("");
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Email Address
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="example@gmail.com"
                                      className="form-control"
                                      value={email}
                                      onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (
                                          firstName.trim() &&
                                          lastName.trim() &&
                                          phone.trim() &&
                                          e.target.value.trim()
                                        ) {
                                          setFormError("");
                                        }
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="col-lg-12">
                                  <div className="mb-3">
                                    <label className="form-label">Note</label>
                                    <textarea
                                      className="form-control"
                                      rows="3"
                                      value={note}
                                      onChange={(e) => setNote(e.target.value)}
                                    ></textarea>
                                  </div>
                                </div>
                              </div>
                              {formError && (
                                <div className="alert alert-danger mt-3">
                                  <i
                                    class="fa fa-exclamation-circle"
                                    aria-hidden="true"
                                  ></i>
                                  &nbsp;
                                  {formError}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="card-footer">
                          <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between">
                            <a
                              href="#"
                              onClick={() => setCurrentStep(1)}
                              className="btn btn-md btn-dark prev_btns inline-flex align-items-center rounded-pill"
                            >
                              <i className="isax isax-arrow-left-2 me-1"></i>
                              Back
                            </a>
                            <a
                              href="#"
                              onClick={() => handleNextStep(3)}
                              className="btn btn-md btn-primary-gradient next_btns inline-flex align-items-center rounded-pill"
                            >
                              Payment
                              <i className="isax isax-arrow-right-3 ms-1"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                    <fieldset
                      style={{ display: currentStep === 3 ? "block" : "none" }}
                    >
                      <div className="card booking-card mb-0">
                        <div className="card-header">
                          <div className="booking-header pb-0">
                            <div className="card mb-0">
                              <div className="card-body">
                                <div className="d-flex align-items-center flex-wrap rpw-gap-2 flex-wrap row-gap-2">
                                  <span className="avatar avatar-xxxl avatar-rounded me-2 flex-shrink-0">
                                    <img
                                      src={
                                        photographer?.avatarUrl ||
                                        "/theme/assets/img/clients/client-15.jpg"
                                      }
                                      alt=""
                                    />
                                  </span>
                                  <div>
                                    <h4 className="mb-1">
                                      {photographer?.businessName ||
                                        photographer?.lastName +
                                          " " +
                                          photographer?.firstName ||
                                        "Unknown Photographer"}
                                      <span className="badge bg-orange fs-12">
                                        <i className="fa-solid fa-star me-1"></i>
                                        5.0
                                      </span>
                                    </h4>
                                    <p className="text-indigo mb-3 fw-medium">
                                      {photographer?.specialty || "-"}
                                    </p>
                                    <p className="mb-0">
                                      <i className="isax isax-location me-2"></i>
                                      {photographer?.locationAddress || "-"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card-body booking-body">
                          <div className="row">
                            <div className="col-lg-6 d-flex">
                              <div className="card flex-fill mb-3 mb-lg-0">
                                <div className="card-body">
                                  <h6 className="mb-3">Payment Information</h6>
                                  <div className="mb-3">
                                    <p>
                                      <i class="fa-solid fa-circle-info"></i>{" "}
                                      Using any Banking App on your mobile
                                      device, scan this QR code and proceed to
                                      payment. After done, click button{" "}
                                      <strong>Confirm Paid</strong> below.
                                    </p>
                                  </div>
                                  <div
                                    className="mb-3"
                                    style={{ textAlign: "center" }}
                                  >
                                    <img
                                      src="/theme/assets/img/qr.jpg"
                                      alt="QR Code"
                                      className="img-fluid"
                                      style={{
                                        maxWidth: "400px",
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 d-flex">
                              <div className="card flex-fill mb-0">
                                <div className="card-body">
                                  <h6 className="mb-3">
                                    <i class="fa-solid fa-cart-shopping"></i>
                                    Booking Overview
                                  </h6>
                                  <p>
                                    Please review carefully your booking details
                                    and proceed to payment to confirm your
                                    booking.
                                  </p>
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Date & Time
                                    </label>
                                    <div className="form-plain-text">
                                      {moment(selectedDate).format(
                                        "DD-MM-YYYY"
                                      ) || "-"}
                                      {", at " + selectedTimeSlot || "-"}
                                    </div>
                                  </div>
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Speciality
                                    </label>
                                    <div className="form-plain-text">
                                      {SPECIALITY_SERVICES.find(
                                        (s) => s.code === speciality
                                      )?.name || "-"}
                                    </div>
                                  </div>
                                  <div className="pt-3 border-top booking-more-info">
                                    <h6 className="mb-3">
                                      Billing Information
                                    </h6>
                                    {selectedServices.map((code, index) => {
                                      const service =
                                        serviceDetails.find(
                                          (s) => s.code === code
                                        ) ||
                                        SPECIALITY_SERVICES.find(
                                          (s) => s.code === code
                                        );
                                      return (
                                        <>
                                          <div
                                            key={code}
                                            className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between mb-2"
                                          >
                                            <p className="mb-0">
                                              {index + 1}. {service?.name}
                                            </p>
                                            <span className="fw-medium d-block">
                                              {service?.price?.toLocaleString(
                                                "vi-VN"
                                              )}{" "}
                                              đ
                                            </span>
                                          </div>
                                          {service.discount > 0 && (
                                            <div
                                              className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between mb-2 "
                                              style={{ paddingLeft: "12px" }}
                                            >
                                              <p className="mb-0">
                                                &#9;Discount ({service.discount}
                                                %)
                                              </p>
                                              <span className="fw-medium text-danger d-block">
                                                -
                                                {(
                                                  service?.price *
                                                  (service.discount / 100)
                                                ).toLocaleString("vi-VN")}{" "}
                                                đ
                                              </span>
                                            </div>
                                          )}
                                        </>
                                      );
                                    })}

                                    {/* <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between mb-2">
                                      <p className="mb-0">Booking Fees</p>
                                      <span className="fw-medium d-block">
                                        $20
                                      </span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between mb-2">
                                      <p className="mb-0">Tax</p>
                                      <span className="fw-medium d-block">
                                        $18
                                      </span>
                                    </div> */}
                                  </div>
                                  <div className="bg-primary d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between p-3 rounded">
                                    <h6 className="text-white">Total</h6>
                                    <h6 className="text-white">
                                      {(getTotalPayment() || 0).toLocaleString(
                                        "vi-VN"
                                      )}{" "}
                                      đ
                                    </h6>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {formError && (
                            <div className="alert alert-danger mt-3">
                              <i
                                class="fa fa-exclamation-circle"
                                aria-hidden="true"
                              ></i>
                              &nbsp;
                              {formError}
                            </div>
                          )}
                          {isAuthenticated === false ? (
                            <div className="alert alert-warning mt-3">
                              <i
                                className="fa fa-exclamation-circle"
                                aria-hidden="true"
                              ></i>
                              &nbsp; Please login to confirm booking
                            </div>
                          ) : null}
                        </div>

                        <div className="card-footer">
                          <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between">
                            <a
                              href="#"
                              onClick={() => setCurrentStep(2)}
                              className="btn btn-md btn-dark prev_btns inline-flex align-items-center rounded-pill"
                            >
                              <i className="isax isax-arrow-left-2 me-1"></i>
                              Back
                            </a>

                            <a
                              onClick={() => handleConfirmPaid()}
                              className="btn btn-md btn-primary-gradient next_btns inline-flex align-items-center rounded-pill"
                              style={{
                                display: isAuthenticated
                                  ? "inline-flex"
                                  : "none",
                              }}
                            >
                              Confirm Paid
                              <i className="isax isax-arrow-right-3 ms-1"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                    <fieldset
                      style={{ display: currentStep === 4 ? "block" : "none" }}
                    >
                      <div className="card booking-card">
                        <div className="card-body booking-body pb-1">
                          <div className="row">
                            <div className="col-lg-12 d-flex">
                              <div className="flex-fill">
                                <div className="card ">
                                  <div className="card-header">
                                    <h5 className="d-flex align-items-center flex-wrap rpw-gap-2">
                                      <i className="isax isax-tick-circle5 text-success me-2"></i>
                                      Booking Successful! Booking ID:{" "}
                                      {bookingCode}
                                    </h5>
                                  </div>
                                  <div className="card-header d-flex align-items-center flex-wrap rpw-gap-2">
                                    <p className="mb-0">
                                      Your Booking has been Confirmed with{" "}
                                      <span className="text-dark">
                                        <b>
                                          {" "}
                                          {photographer?.businessName || "-"}
                                        </b>
                                      </span>{" "}
                                      be on time before{" "}
                                      <span className="text-dark">
                                        <b> 15 Mins </b>
                                      </span>{" "}
                                      From the appointment Time
                                    </p>
                                  </div>
                                  <div className="card-body pb-1">
                                    <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between mb-3">
                                      <h6>Booking Information</h6>
                                      {/* <a
                                        href="#"
                                        className="btn btn-light rounded-pill"
                                      >
                                        <i className="isax isax-calendar me-1"></i>
                                        Reschedule
                                      </a> */}
                                    </div>
                                    <div className="row">
                                      <div className="col-md-6">
                                        <div className="mb-3">
                                          <label className="form-label">
                                            Speciality
                                          </label>
                                          <div className="form-plain-text">
                                            {SPECIALITY_SERVICES.find(
                                              (s) => s.code === speciality
                                            )?.name || "-"}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="mb-3">
                                          <label className="form-label">
                                            Services
                                          </label>
                                          <div className="form-plain-text">
                                            {selectedServices.length > 0
                                              ? selectedServices
                                                  .map(
                                                    (code) =>
                                                      (
                                                        serviceDetails.find(
                                                          (s) => s.code === code
                                                        ) ||
                                                        SPECIALITY_SERVICES.find(
                                                          (s) => s.code === code
                                                        )
                                                      )?.name
                                                  )
                                                  .filter(Boolean)
                                                  .join(", ")
                                              : "-"}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="mb-3">
                                          <label className="form-label">
                                            Date & Time
                                          </label>
                                          <div className="form-plain-text">
                                            {moment(selectedDate).format(
                                              "DD-MM-YYYY"
                                            ) || "-"}
                                            {", at " + selectedTimeSlot || "-"}
                                          </div>
                                        </div>
                                      </div>
                                      {/* <div className="col-md-6">
                                        <div className="mb-3">
                                          <label className="form-label">
                                            Appointment type
                                          </label>
                                          <div className="form-plain-text">
                                            Clinic{" "}
                                          </div>
                                        </div>
                                      </div> */}
                                      <div className="col-md-6">
                                        <div className="mb-3">
                                          <label className="form-label">
                                            Fullname
                                          </label>
                                          <div className="form-plain-text">
                                            {`${firstName} ${lastName}` || "-"}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="mb-3">
                                          <label className="form-label">
                                            Phone Number
                                          </label>
                                          <div className="form-plain-text">
                                            {`${phone}` || "-"}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="mb-3">
                                          <label className="form-label">
                                            Note
                                          </label>
                                          <div className="form-plain-text">
                                            {`${note}` || "-"}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="card">
                                  <div className="card-body d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between">
                                    <div>
                                      <h6 className="mb-1">
                                        Need Our Assistance
                                      </h6>
                                      <p className="mb-0">
                                        Call us in case you face any Issue on
                                        Booking / Cancellation
                                      </p>
                                      <p>
                                        Support Time: Mon - Sun 8.00am - 6.00pm
                                      </p>
                                    </div>
                                    <a
                                      href="#"
                                      className="btn btn-light rounded-pill"
                                    >
                                      <i className="isax isax-call5 me-1"></i>
                                      0987654321
                                    </a>
                                  </div>
                                </div>
                                <div className="card-footer">
                                  <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between">
                                    <a
                                      href="#"
                                      onClick={() => setCurrentStep(3)}
                                      className="btn btn-md btn-dark prev_btns inline-flex align-items-center rounded-pill"
                                    >
                                      <i className="isax isax-arrow-left-2 me-1"></i>
                                      Back
                                    </a>
                                    <a
                                      style={{
                                        cursor: "pointer",
                                        width: "50%",
                                      }}
                                      href="#"
                                      onClick={resetBooking}
                                      className="btn btn-md btn-primary-gradient next_btns inline-flex align-items-center rounded-pill"
                                    >
                                      Start New Booking
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                  <div className="text-center">
                    <p className="mb-0">
                      Copyright © 2025. All Rights Reserved, Photography
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
