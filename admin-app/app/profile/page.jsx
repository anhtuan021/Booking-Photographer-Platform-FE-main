"use client";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import RequireAuth from "../../components/RequireAuth";
import { SPECIALITY_SERVICES } from "../constants/commont";
import moment from "moment";
export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editForm, setEditForm] = useState({
    businessName: "",
    bio: "",
    minPrice: "",
    lastName: "",
    dateOfBirth: "",
    firstName: "",
    yearsExperience: "",
    specialties: [],
    languages: [],
    locationAddress: "",
    address: "",
    city: "",
    ward: "",
    avatar: "",
    gender: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [role, setRole] = useState("");
  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setError(null);
        const user = JSON.parse(localStorage.getItem("admin_user") || "{}");
        setUserInfo(user);
        const role = user?.role;
        setRole(role);
        let api = "/api/v1/profiles/me";
        if (role === "ADMIN") {
          api = "/api/v1/admin/me";
        } else if (role === "PHOTOGRAPHER") {
          api = "/api/v1/profiles/me";
        } else {
          throw new Error("Role không hợp lệ");
        }

        const res = await fetch(api, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        if (role === "ADMIN") {
          setProfile({
            ...data.responseData,
            businessName:
              data.responseData.firstName + " " + data.responseData.lastName ||
              "",
            locationAddress: data.responseData.address || "",
          });
        } else {
          setProfile(data?.responseData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);
  // const getRandomImage = () => {
  //   const num = Math.floor(Math.random() * 4) + 1;
  //   const paddedNum = num < 10 ? `0${num}` : num;
  //   console.log({ paddedNum });

  //   return `/theme/admin/assets/img/profiles/avatar-${paddedNum}.jpg`;
  // };
  const handleEditClick = () => {
    if (role == "ADMIN") {
      setEditForm({
        lastName: profile.lastName || "",
        firstName: profile.firstName || "",
        dateOfBirth: profile.dateOfBirth
          ? moment(profile.dateOfBirth, "DD-MM-YYYY").format("YYYY-MM-DD")
          : "",
        address: profile.address || "",
        locationAddress: profile.address || "",
        city: profile.city || "",
        ward: profile.ward || "",
        avatar: profile.avatarUrl || "",
        gender: profile.gender || "",
        phone: profile.phone || "",
      });
    } else {
      setEditForm({
        businessName: profile.businessName || "",
        bio: profile.bio || "",
        minPrice: profile.minPrice || "",
        lastName: profile.lastName || "",
        firstName: profile.firstName || "",
        dateOfBirth: profile.dateOfBirth
          ? moment(profile.dateOfBirth, "DD-MM-YYYY").format("YYYY-MM-DD")
          : "",
        yearsExperience: profile.yearsExperience || "",
        specialties: profile.specialties || [],
        languages: profile.languages || [],
        locationAddress: profile.locationAddress || "",
        city: profile.city || "",
        ward: profile.ward || "",
        avatar: profile.avatarUrl || "",
      });
    }
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(editForm);
  };

  // Với specialties và languages là mảng:
  const handleSpecialtyChange = (spec) => {
    setEditForm((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(spec)
        ? prev.specialties.filter((s) => s !== spec)
        : [...prev.specialties, spec],
    }));
  };

  const handleLanguagesChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      languages: e.target.value.split(",").map((lang) => lang.trim()),
    }));
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    try {
      let api = "";

      const formData = new FormData();
      if (editForm.avatar) formData.append("avatar", editForm.avatar);

      if (role === "ADMIN") {
        api = `/api/v1/admin/me`;
        formData.append("firstName", editForm.firstName);
        formData.append("lastName", editForm.lastName);
        formData.append("gender", editForm.gender || "");
        formData.append("phone", editForm.phone || "");
        formData.append("address", editForm.address || "");
        formData.append(
          "dateOfBirth",
          moment(editForm.dateOfBirth).format("DD/MM/YYYY")
        );
        formData.append("email", editForm.email || "");
        formData.append("city", editForm.city);
        formData.append("ward", editForm.ward);
      } else {
        api = `/api/v1/profiles/me`;
        formData.append("firstName", editForm.firstName);
        formData.append("lastName", editForm.lastName);
        formData.append("businessName", editForm.businessName);
        formData.append(
          "dateOfBirth",
          moment(editForm.dateOfBirth).format("DD/MM/YYYY")
        );
        formData.append("bio", editForm.bio);
        formData.append("minPrice", editForm.minPrice);
        formData.append("yearsExperience", Number(editForm.yearsExperience));
        formData.append("specialties", editForm.specialties.join(","));
        formData.append("languages", editForm.languages.join(","));
        formData.append("locationAddress", editForm.locationAddress);
        formData.append("city", editForm.city);
        formData.append("ward", editForm.ward);
        formData.append("avatar", editForm.avatar);
      }
      const res = await fetch(api, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(
          data?.responseStatus?.responseMessage || "Update failed"
        );
      }
      // Sau khi cập nhật thành công, reload lại profile
      const data = await res.json();
      if (role === "ADMIN") {
        setProfile({
          ...data.responseData,
          businessName:
            data.responseData.firstName + " " + data.responseData.lastName ||
            "",
          locationAddress: data.responseData.address || "",
        });
      } else {
        setProfile(data.responseData);
      }
      setEditSuccess("Update profile successfully!");
      // Đóng modal
      window.$("#edit_personal_details").modal("hide");
    } catch (err) {
      setEditError(err.message);
    } finally {
      setEditLoading(false);
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
                <div className="col">
                  <h3 className="page-title">
                    <i class="fa fa-id-card" aria-hidden="true"></i> Profile{" "}
                    {role}
                  </h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item active">
                      Home{" "}
                      <i
                        class="fa fa-angle-double-right"
                        aria-hidden="true"
                      ></i>{" "}
                      Profile
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                {editSuccess && (
                  <div className="alert alert-success">{editSuccess}</div>
                )}
                {loading ? (
                  <div>Loading...</div>
                ) : error ? (
                  <div className="text-danger">{error}</div>
                ) : profile ? (
                  <>
                    <div className="profile-header">
                      <div className="row align-items-center">
                        <div className="col-auto profile-image">
                          <a href="#">
                            <img
                              className="rounded-circle"
                              alt="User Image"
                              src={
                                profile.avatarUrl ||
                                "/theme/admin/assets/img/patients/patient2.jpg"
                              }
                            />
                          </a>
                        </div>
                        <div className="col ml-md-n2 profile-user-info">
                          <h4 className="user-name mb-0">
                            {profile.businessName ||
                              "-" ||
                              profile.firstName + " " + profile.lastName}
                          </h4>
                          <h6 className="text-muted">
                            {userInfo.email || "[email protected]"}
                          </h6>
                          <div className="user-Location">
                            <i className="fa-solid fa-location-dot" />{" "}
                            {profile.address ||
                              profile.locationAddress +
                                " " +
                                profile.ward +
                                " " +
                                profile.city ||
                              ""}
                          </div>
                          {role === "PHOTOGRAPHER" && (
                            <div
                              style={{
                                whiteSpace: "pre-line",
                                textAlign: "justify",
                              }}
                            >
                              <strong>Bio: </strong>
                              {profile.bio || "Chưa có mô tả cá nhân."}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="tab-content profile-tab-cont">
                      <div
                        className="tab-pane fade show active"
                        id="per_details_tab"
                      >
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="card">
                              <div className="card-body">
                                <h5 className="card-title d-flex justify-content-between">
                                  <span>Personal Details</span>
                                  <a
                                    className="edit-link"
                                    data-bs-toggle="modal"
                                    href="#edit_personal_details"
                                    onClick={handleEditClick}
                                  >
                                    <i className="fa fa-edit me-1"></i>Edit
                                  </a>
                                </h5>
                                {role == "PHOTOGRAPHER" && (
                                  <div className="row">
                                    <p className="col-sm-2 text-muted">
                                      Business Name
                                    </p>
                                    <p className="col-sm-10">
                                      {profile.businessName || ""}
                                    </p>
                                  </div>
                                )}

                                <div className="row">
                                  <p className="col-sm-2 text-muted">
                                    Full Name
                                  </p>
                                  <p className="col-sm-10">
                                    {profile?.firstName
                                      ? profile?.firstName +
                                        " " +
                                        profile?.lastName
                                      : ""}
                                  </p>
                                </div>
                                <div className="row">
                                  <p className="col-sm-2 text-muted">Gender</p>
                                  <p className="col-sm-10">
                                    {profile?.gender || ""}
                                  </p>
                                </div>
                                <div className="row">
                                  <p className="col-sm-2 text-muted">Rating</p>
                                  <p className="col-sm-10">
                                    {profile?.averageRating || ""}
                                  </p>
                                </div>
                                <div className="row">
                                  <p className="col-sm-2 text-muted">
                                    Total Bookings
                                  </p>
                                  <p className="col-sm-10">
                                    {profile?.totalBookings || ""}
                                  </p>
                                </div>
                                <div className="row">
                                  <p className="col-sm-2 text-muted">
                                    Total Reviews
                                  </p>
                                  <p className="col-sm-10">
                                    {profile?.totalFeedbacks || ""}
                                  </p>
                                </div>
                                <div className="row">
                                  <p className="col-sm-2 text-muted">
                                    Phone Number
                                  </p>
                                  <p className="col-sm-10">0987654321</p>
                                </div>
                                <div className="row">
                                  <p className="col-sm-2 text-muted">Address</p>
                                  <p className="col-sm-10 mb-0">
                                    {profile.locationAddress +
                                      " " +
                                      profile.ward +
                                      " " +
                                      profile.city || ""}
                                  </p>
                                </div>
                                {role == "PHOTOGRAPHER" && (
                                  <div className="row">
                                    <p className="col-sm-2 text-muted">
                                      Status
                                    </p>
                                    <p className="col-sm-10">
                                      {profile.status}
                                    </p>
                                  </div>
                                )}
                                <div className="row">
                                  <p className="col-sm-2 text-muted">
                                    Date of Birth
                                  </p>
                                  <p className="col-sm-10">
                                    {moment(
                                      profile.dateOfBirth,
                                      "DD-MM-YYYY"
                                    ).format("DD/MM/YYYY") || "-"}
                                  </p>
                                </div>
                                <div className="row">
                                  <p className="col-sm-2 text-muted">Email</p>
                                  <p className="col-sm-10">
                                    {profile.email || userInfo.email || ""}
                                  </p>
                                </div>
                                {role === "PHOTOGRAPHER" && (
                                  <>
                                    <div className="row">
                                      <p className="col-sm-2 text-muted">
                                        Years Experience
                                      </p>
                                      <p className="col-sm-10">
                                        {profile.yearsExperience} Years
                                      </p>
                                    </div>

                                    <div className="row">
                                      <p className="col-sm-2 text-muted">
                                        Min Price
                                      </p>
                                      <p className="col-sm-10">
                                        {profile.minPrice
                                          ? Number(
                                              profile.minPrice
                                            ).toLocaleString("vi-VN") + " VND"
                                          : "0 VND"}
                                      </p>
                                    </div>
                                    <div className="mb-3 row">
                                      <p className="col-sm-2 text-muted">
                                        Specialties
                                      </p>
                                      <div className="col-md-10">
                                        {SPECIALITY_SERVICES.map((spec) => (
                                          <div className="checkbox" key={spec}>
                                            <label>
                                              <input
                                                type="checkbox"
                                                name="specialties"
                                                checked={
                                                  Array.isArray(
                                                    profile.specialties
                                                  ) &&
                                                  profile.specialties.includes(
                                                    spec.code
                                                  )
                                                }
                                                readOnly
                                              />{" "}
                                              {spec.name}
                                            </label>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="mb-3 row">
                                      <p className="col-sm-2 text-muted">
                                        Laguages
                                      </p>
                                      <div className="col-md-10">
                                        {[
                                          "Vietnamese",
                                          "English",
                                          "French",
                                          "Spanish",
                                          "German",
                                          "Japanese",
                                          "Others",
                                        ].map((spec) => (
                                          <div className="checkbox" key={spec}>
                                            <label>
                                              <input
                                                type="checkbox"
                                                name="languages"
                                                checked={
                                                  Array.isArray(
                                                    profile.languages
                                                  ) &&
                                                  profile.languages.includes(
                                                    spec
                                                  )
                                                }
                                                readOnly
                                              />{" "}
                                              {spec}
                                            </label>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                            <div
                              className="modal fade"
                              id="edit_personal_details"
                              aria-hidden="true"
                              role="dialog"
                            >
                              <div
                                className="modal-dialog modal-dialog-centered modal-lg"
                                role="document"
                              >
                                <div className="modal-content">
                                  <div className="modal-header">
                                    <h5 className="modal-title">
                                      Personal Details
                                    </h5>
                                    <button
                                      type="button"
                                      className="btn-close"
                                      data-bs-dismiss="modal"
                                      aria-label="Close"
                                    ></button>
                                  </div>
                                  <div className="modal-body">
                                    <form onSubmit={handleEditSubmit}>
                                      {role === "ADMIN" ? (
                                        <>
                                          <div className="mb-3">
                                            <label>Full Name</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              name="fullName"
                                              value={
                                                editForm.firstName
                                                  ? editForm.firstName +
                                                    " " +
                                                    editForm.lastName
                                                  : ""
                                              }
                                              onChange={(e) => {
                                                const [firstName, ...lastName] =
                                                  e.target.value.split(" ");
                                                setEditForm((f) => ({
                                                  ...f,
                                                  firstName,
                                                  lastName: lastName.join(" "),
                                                }));
                                              }}
                                            />
                                          </div>
                                          <div className="mb-3">
                                            <label>Gender</label>
                                            <select
                                              className="form-control"
                                              name="gender"
                                              value={editForm.gender || ""}
                                              onChange={handleEditChange}
                                            >
                                              <option value="">
                                                Select gender
                                              </option>
                                              <option value="MALE">Male</option>
                                              <option value="FEMALE">
                                                Female
                                              </option>
                                              <option value="OTHER">
                                                Other
                                              </option>
                                            </select>
                                          </div>
                                          <div className="mb-3">
                                            <label>Phone Number</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              name="phone"
                                              value={editForm.phone || ""}
                                              onChange={handleEditChange}
                                            />
                                          </div>
                                          <div className="mb-3">
                                            <label>Date of Birth</label>
                                            <input
                                              type="date"
                                              className="form-control"
                                              name="dateOfBirth"
                                              value={editForm.dateOfBirth}
                                              onChange={handleEditChange}
                                            />
                                          </div>
                                          <div className="mb-3">
                                            <label>Address</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              name="address"
                                              value={editForm.address}
                                              onChange={handleEditChange}
                                            />
                                          </div>

                                          <div className="mb-3">
                                            <label>City</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              name="city"
                                              value={editForm.city}
                                              onChange={handleEditChange}
                                            />
                                          </div>
                                          <div className="mb-3">
                                            <label>Ward</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              name="ward"
                                              value={editForm.ward}
                                              onChange={handleEditChange}
                                            />
                                          </div>
                                          <div className="col-12 ">
                                            <div className="mb-3">
                                              <label className="mb-2">
                                                Avatar
                                              </label>
                                              <input
                                                type="file"
                                                className="form-control"
                                                onChange={(e) =>
                                                  setEditForm((f) => ({
                                                    ...f,
                                                    avatar: e.target.files[0],
                                                  }))
                                                }
                                                placeholder="Select Avatar"
                                              />
                                            </div>
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          <div className="mb-3">
                                            <label>Business Name</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              name="businessName"
                                              value={editForm.businessName}
                                              onChange={handleEditChange}
                                            />
                                          </div>
                                          <div className="mb-3">
                                            <label>First Name</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              name="firstName"
                                              value={editForm.firstName}
                                              onChange={handleEditChange}
                                            />
                                          </div>
                                          <div className="mb-3">
                                            <label>Last Name</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              name="lastName"
                                              value={editForm.lastName}
                                              onChange={handleEditChange}
                                            />
                                          </div>
                                          <div className="mb-3">
                                            <label>Date of Birth</label>
                                            <input
                                              type="date"
                                              className="form-control"
                                              name="dateOfBirth"
                                              value={editForm.dateOfBirth}
                                              onChange={handleEditChange}
                                            />
                                          </div>
                                          <div className="mb-3">
                                            <label>Bio</label>
                                            <textarea
                                              style={{ height: 120 }}
                                              className="form-control"
                                              name="bio"
                                              rows="3"
                                              value={editForm.bio}
                                              onChange={handleEditChange}
                                            />
                                          </div>
                                          <div className="mb-3">
                                            <label>Min Price</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              name="minPrice"
                                              value={editForm.minPrice}
                                              onChange={handleEditChange}
                                            />
                                          </div>
                                          <div className="mb-3">
                                            <label>Years Experience</label>
                                            <input
                                              type="number"
                                              min="0"
                                              className="form-control"
                                              name="yearsExperience"
                                              value={editForm.yearsExperience}
                                              onChange={handleEditChange}
                                            />
                                          </div>
                                          <div className="mb-3">
                                            <label>Specialties</label>
                                            <div>
                                              {SPECIALITY_SERVICES.map(
                                                (spec) => (
                                                  <label
                                                    key={spec}
                                                    className="me-3"
                                                  >
                                                    <input
                                                      type="checkbox"
                                                      checked={editForm.specialties.includes(
                                                        spec.code
                                                      )}
                                                      onChange={() =>
                                                        handleSpecialtyChange(
                                                          spec.code
                                                        )
                                                      }
                                                    />{" "}
                                                    {spec.name}
                                                  </label>
                                                )
                                              )}
                                            </div>
                                          </div>
                                          <div className="mb-3">
                                            <label>
                                              Languages (phân cách bằng dấu
                                              phẩy)
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              name="languages"
                                              placeholder="Vietnamese, English, French,..."
                                              value={editForm.languages.join(
                                                ", "
                                              )}
                                              onChange={handleLanguagesChange}
                                            />
                                          </div>
                                          <div className="mb-3">
                                            <label>Location Address</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              name="locationAddress"
                                              value={editForm.locationAddress}
                                              onChange={handleEditChange}
                                            />
                                          </div>
                                          <div className="mb-3">
                                            <label>City</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              name="city"
                                              value={editForm.city}
                                              onChange={handleEditChange}
                                            />
                                          </div>
                                          <div className="mb-3">
                                            <label>Ward</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              name="ward"
                                              value={editForm.ward}
                                              onChange={handleEditChange}
                                            />
                                          </div>
                                          <div className="col-12 ">
                                            <div className="mb-3">
                                              <label className="mb-2">
                                                Avatar
                                              </label>
                                              <input
                                                type="file"
                                                className="form-control"
                                                onChange={(e) =>
                                                  setEditForm((f) => ({
                                                    ...f,
                                                    avatar: e.target.files[0],
                                                  }))
                                                }
                                                placeholder="Select Avatar"
                                              />
                                            </div>
                                          </div>
                                        </>
                                      )}
                                      {editError && (
                                        <div className="text-danger mb-2">
                                          {editError}
                                        </div>
                                      )}
                                      <button
                                        type="submit"
                                        className="btn btn-primary w-100"
                                        disabled={editLoading}
                                      >
                                        {editLoading ? "Đang lưu..." : "Save"}
                                      </button>
                                    </form>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div id="password_tab" className="tab-pane fade">
                        <div className="card">
                          <div className="card-body">
                            <h5 className="card-title">Change Password</h5>
                            <div className="row">
                              <div className="col-md-10 col-lg-6">
                                <form>
                                  <div className="mb-3">
                                    <label className="mb-2">Old Password</label>
                                    <input
                                      type="password"
                                      className="form-control"
                                    />
                                  </div>
                                  <div className="mb-3">
                                    <label className="mb-2">New Password</label>
                                    <input
                                      type="password"
                                      className="form-control"
                                    />
                                  </div>
                                  <div className="mb-3">
                                    <label className="mb-2">
                                      Confirm Password
                                    </label>
                                    <input
                                      type="password"
                                      className="form-control"
                                    />
                                  </div>
                                  <button
                                    className="btn btn-primary"
                                    type="submit"
                                  >
                                    Save Changes
                                  </button>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
