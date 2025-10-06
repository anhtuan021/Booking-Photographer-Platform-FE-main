"use client";
import { useEffect, useState, useRef } from "react";
import RequireAuth from "../../components/RequireAuth";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import moment from "moment";
import { SPECIALITY_SERVICES } from "../constants/commont";
import "./page.css";

export default function AlbumsPage() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dtRef = useRef(null);
  const [viewAlbum, setViewAlbum] = useState(null);
  useEffect(() => {
    async function fetchGalleries() {
      try {
        setLoading(true);
        setError(null);
        const api = `/api/v1/portfolios/me`;
        const res = await fetch(api, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch galleries");
        const data = await res.json();
        setGalleries(data?.responseData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchGalleries();
  }, []);

  useEffect(() => {
    if (!dtRef.current) {
      dtRef.current = $("#portfolio-table").DataTable({
        autoWidth: false,
      });
    }
  }, []);
  useEffect(() => {
    if (dtRef.current) {
      dtRef.current.clear();
      let sortedGalleries = [];
      if (galleries && galleries.length) {
        sortedGalleries = [...galleries].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        sortedGalleries.forEach((album, idx) => {
          dtRef.current.row.add([
            idx + 1,
            album.title || "-",
            `${
              album.minPrice
                ? Number(album.minPrice).toLocaleString("vi-VN")
                : "0"
            }`,
            album.category || "-",
            album.status || "-",
            moment(album.createdAt).format("DD/MM/YYYY") || "-",
            Array.isArray(album.imageUrl) && album.imageUrl.length > 0
              ? album.imageUrl
                  .map(
                    (img) =>
                      `<a href="/profile" class="avatar avatar-sm me-2">
                        <img class="avatar-img" src="${
                          img ||
                          "/theme/admin/assets/img/specialities/specialities-06.png"
                        }" alt="img"/>
                      </a>`
                  )
                  .join("")
              : `
                <a href="/profile" class="avatar avatar-sm me-2">
                        <img class="avatar-img" src="/theme/admin/assets/img/specialities/specialities-06.png" alt="img"/>
                      </a>`,
            `<div class="actions">
              <a href="#" class="btn btn-success-light album-title-link1" data-album-index="${album.id}" style="background-color: #fefe;">
               <i class="fe fe-eye"></i>View</a>
                    <a class="btn btn-sm bg-success-light" data-bs-toggle="modal" href="#edit_album_details">
                      <i class="fe fe-pencil"></i> Edit
                    </a>
                    <a class="btn btn-sm bg-danger-light" data-bs-toggle="modal" href="#delete_modal">
                      <i class="fe fe-trash"></i> Delete
                    </a>
                  </div>`,
          ]);
        });
      }
      dtRef.current.draw(false);
    }
  }, [galleries]);
  useEffect(() => {
    if (dtRef.current) {
      $("#portfolio-table").off("click", ".album-title-link1");
      $("#portfolio-table").on("click", ".album-title-link1", function (e) {
        e.preventDefault();
        const idx = $(this).data("album-index");
        if (galleries.find((g) => g.id === idx)) {
          setViewAlbum(galleries.find((g) => g.id === idx));
          const modal = document.getElementById("view_album_modal");
          if (modal) {
            const modalInstance =
              window.bootstrap.Modal.getOrCreateInstance(modal);
            modalInstance.show();
          }
        }
      });
    }
  }, [galleries]);
  // State cho form add portfolio
  const [addForm, setAddForm] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    images: [],
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  // Xử lý submit form add portfolio
  async function handleAddPortfolio(e) {
    e.preventDefault();
    setAddError("");
    setAddLoading(true);
    try {
      const formData = new FormData();
      addForm.images.forEach((file) => {
        formData.append("images", file);
      });
      formData.append("title", addForm.title);
      formData.append("description", addForm.description);
      formData.append("category", addForm.category || "WEDDING");
      formData.append("tags", addForm.tags);
      formData.append("displayOrder", "1");
      formData.append("isFeatured", "true");

      const api = `/api/v1/portfolios`;
      const res = await fetch(api, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error("Thêm portfolio thất bại");
      // Sau khi thêm thành công, reload lại danh sách
      setAddForm({
        title: "",
        description: "",
        category: "",
        tags: "",
        images: [],
      });
      document.getElementById("Add_Album").classList.remove("show");
      const modal = document.getElementById("Add_Album");
      if (modal) {
        const modalInstance = window.bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
        }
      }
      setLoading(true);
      setError(null);
      const getRes = await fetch(`/api/v1/portfolios/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });
      const getData = await getRes.json();
      setGalleries(getData?.responseData || []);
      setLoading(false);
    } catch (err) {
      setAddError(err.message);
      setAddLoading(false);
    }
  }

  //edit
  const [editForm, setEditForm] = useState({
    id: "",
    title: "",
    description: "",
    category: "",
    tags: "",
    images: [],
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  useEffect(() => {
    $("#portfolio-table").off("click", ".btn.bg-success-light");
    $("#portfolio-table").on("click", ".btn.bg-success-light", function (e) {
      e.preventDefault();
      const idx = $(this)
        .closest("tr")
        .find(".album-title-link1")
        .data("album-index");
      if (galleries.find((g) => g.id === idx)) {
        const album = galleries.find((g) => g.id === idx);
        setEditForm({
          id: album.id,
          title: album.title || "",
          description: album.description || "",
          category: album.category || "",
          tags: Array.isArray(album.tags)
            ? album.tags.join(", ")
            : album.tags || "",
          images: [],
        });
        const modal = document.getElementById("edit_album_details");
        if (modal) {
          const modalInstance =
            window.bootstrap.Modal.getOrCreateInstance(modal);
          modalInstance.show();
        }
      }
    });
  }, [galleries]);
  function handleEditChange(e) {
    const { name, value, type, checked } = e.target;
    setEditForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleEditTags(e) {
    setEditForm((f) => ({
      ...f,
      tags: e.target.value,
    }));
  }
  function handleEditImage(e) {
    setEditForm((f) => ({
      ...f,
      images: Array.from(e.target.files),
    }));
  }
  async function handleEditSubmit(e) {
    e.preventDefault();
    setEditError("");
    setEditLoading(true);
    try {
      const formData = new FormData();
      if (editForm.images) formData.append("image", editForm.images);
      formData.append("title", editForm.title);
      formData.append("description", editForm.description);
      formData.append("category", editForm.category);
      formData.append("tags", editForm.tags);
      formData.append("minPrice", editForm.minPrice);
      formData.append("portfolioId", editForm.id);

      const api = `/api/v1/portfolios`;
      const res = await fetch(api, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error("Cập nhật album thất bại");
      // Reload lại danh sách
      const getRes = await fetch(`/api/v1/portfolios/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });
      const getData = await getRes.json();
      setGalleries(getData?.responseData || []);
      setEditLoading(false);
      // Đóng modal
      const modal = document.getElementById("edit_album_details");
      if (modal) {
        const modalInstance = window.bootstrap.Modal.getInstance(modal);
        if (modalInstance) modalInstance.hide();
      }
    } catch (err) {
      setEditError(err.message);
      setEditLoading(false);
    }
  }
  return (
    <RequireAuth>
      <div className="main-wrapper">
        <Header />
        <Sidebar />

        <div className="page-wrapper">
          <div className="content container-fluid">
            <div className="page-header">
              <div className="row">
                <div className="col-sm-7 col-auto">
                  <h3 className="page-title">Portfolios</h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item active">
                      Home{" "}
                      <i
                        class="fa fa-angle-double-right"
                        aria-hidden="true"
                      ></i>{" "}
                      <a href="#">Portfolios</a>
                    </li>
                  </ul>
                </div>
                <div className="col-sm-5 col">
                  <a
                    href="#Add_Album"
                    data-bs-toggle="modal"
                    className="btn btn-primary btn-rounded float-end mt-2"
                  >
                    <i className="fa fa-plus"></i> Add new Portfolios
                  </a>
                </div>
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
                        id="portfolio-table"
                        className=" table table-hover table-center mb-0"
                      >
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Min Price</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Images</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody></tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Album Modal */}
            <div
              className="modal fade"
              id="Add_Album"
              aria-hidden="true"
              role="dialog"
            >
              <div
                className="modal-dialog modal-dialog-centered modal-lg"
                role="document"
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Add Portfolio</h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleAddPortfolio}>
                      <div className="row">
                        <div className="col-12 col-sm-6">
                          <div className="mb-3">
                            <label className="mb-2">Title</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Portfolio Album Title"
                              value={addForm.title}
                              onChange={(e) =>
                                setAddForm((f) => ({
                                  ...f,
                                  title: e.target.value,
                                }))
                              }
                              required
                            />
                          </div>
                        </div>
                        <div className="col-12 col-sm-6">
                          <div className="mb-3">
                            <label className="mb-2">Tags</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g. wedding, outdoor, wedding"
                              value={addForm.tags}
                              onChange={(e) =>
                                setAddForm((f) => ({
                                  ...f,
                                  tags: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <div className="mb-3">
                            <label className="mb-2">Description</label>
                            <input
                              type="text"
                              className="form-control"
                              value={addForm.description}
                              onChange={(e) =>
                                setAddForm((f) => ({
                                  ...f,
                                  description: e.target.value,
                                }))
                              }
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <div className="mb-3">
                            <label className="mb-2">Services</label>
                            <div className="col-md-10">
                              {SPECIALITY_SERVICES.map((cat) => (
                                <div className="checkbox" key={cat.code}>
                                  <label>
                                    <input
                                      type="radio"
                                      name="category"
                                      checked={addForm.category === cat.code}
                                      onChange={() =>
                                        setAddForm((f) => ({
                                          ...f,
                                          category: cat.code,
                                        }))
                                      }
                                    />{" "}
                                    {cat.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>{" "}
                      <div className="row">
                        <div className="col-12 ">
                          <div className="mb-3">
                            <label className="mb-2">Image</label>
                            <input
                              type="file"
                              className="form-control"
                              onChange={(e) =>
                                setAddForm((f) => ({
                                  ...f,
                                  images: Array.from(e.target.files),
                                }))
                              }
                              placeholder="Image URL"
                              required
                              multiple
                            />
                          </div>
                        </div>
                      </div>
                      {addError && (
                        <div className="text-danger mb-2">{addError}</div>
                      )}
                      <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={addLoading}
                      >
                        {addLoading ? "Adding..." : "ADD"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Album Modal */}
            <div
              className="modal fade"
              id="edit_album_details"
              aria-hidden="true"
              role="dialog"
            >
              <div
                className="modal-dialog modal-dialog-centered modal-lg"
                role="document"
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Portfolio</h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleEditSubmit}>
                      <div className="row">
                        <div className="col-12 col-sm-12">
                          <div className="mb-3">
                            <label className="mb-2">Title</label>
                            <input
                              type="text"
                              className="form-control"
                              name="title"
                              value={editForm.title}
                              placeholder="Portfolio Album Title"
                              onChange={handleEditChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12 col-sm-6">
                          <div className="mb-3">
                            <label className="mb-2">Min Price</label>
                            <input
                              type="number"
                              className="form-control"
                              name="minPrice"
                              value={editForm.minPrice}
                              placeholder="Min Price"
                              onChange={handleEditChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-12 col-sm-6">
                          <div className="mb-3">
                            <label className="mb-2">Tags</label>
                            <input
                              type="text"
                              className="form-control"
                              name="tags"
                              placeholder="e.g. wedding, outdoor, wedding"
                              value={editForm.tags}
                              onChange={handleEditTags}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <div className="mb-3">
                            <label className="mb-2">Description</label>
                            <input
                              type="text"
                              className="form-control"
                              name="description"
                              placeholder="Short description about album"
                              value={editForm.description}
                              onChange={handleEditChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <div className="mb-3">
                            <label className="mb-2">Services</label>
                            <div className="col-md-10">
                              {SPECIALITY_SERVICES.map((cat) => (
                                <div className="checkbox" key={cat.code}>
                                  <label>
                                    <input
                                      type="radio"
                                      name="category"
                                      checked={editForm.category === cat.code}
                                      onChange={() =>
                                        setEditForm((f) => ({
                                          ...f,
                                          category: cat.code,
                                        }))
                                      }
                                    />{" "}
                                    {cat.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12 ">
                          <div className="mb-3">
                            <label className="mb-2">Image</label>
                            <input
                              type="file"
                              className="form-control"
                              onChange={handleEditImage}
                              placeholder="Image URL"
                              multiple
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {editError && (
                        <div className="text-danger mb-2">{editError}</div>
                      )}
                      <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={editLoading}
                      >
                        {editLoading ? "Saving..." : "Save"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            {/* View Album Modal */}
            <div
              className="modal fade"
              id="view_album_modal"
              aria-hidden="true"
              role="dialog"
            >
              <div
                className="modal-dialog modal-dialog-centered modal-lg"
                role="document"
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Album Details</h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    {viewAlbum ? (
                      <div>
                        <h4>{viewAlbum.title}</h4>
                        <p>
                          <strong>Description:</strong> {viewAlbum.description}
                        </p>
                        <p>
                          <strong>Category:</strong> {viewAlbum.category}
                        </p>
                        <p>
                          <strong>Tags:</strong>{" "}
                          {Array.isArray(viewAlbum.tags)
                            ? viewAlbum.tags.join(", ")
                            : viewAlbum.tags || "-"}
                        </p>
                        <p>
                          <strong>Status:</strong> {viewAlbum.status}
                        </p>
                        <p>
                          <strong>Display Order:</strong>{" "}
                          {viewAlbum.displayOrder ?? "-"}
                        </p>
                        <p>
                          <strong>Is Featured:</strong>{" "}
                          {viewAlbum.isFeatured ? "Yes" : "No"}
                        </p>
                        <p>
                          <strong>Created At:</strong>{" "}
                          {moment(viewAlbum.createdAt).format("DD/MM/YYYY")}
                        </p>
                        <p>
                          <strong>Updated At:</strong>{" "}
                          {viewAlbum.updatedAt
                            ? moment(viewAlbum.updatedAt).format("DD/MM/YYYY")
                            : "-"}
                        </p>
                        {Array.isArray(viewAlbum.imageUrl) &&
                        viewAlbum.imageUrl.length > 0 ? (
                          <div
                            style={{
                              display: "flex",
                              gap: 8,
                              flexWrap: "wrap",
                            }}
                          >
                            {viewAlbum.imageUrl.map((img, idx) => (
                              <img
                                key={idx}
                                src={
                                  img ||
                                  "/theme/admin/assets/img/specialities/specialities-06.png"
                                }
                                alt="Album"
                                style={{ maxWidth: 120, borderRadius: 8 }}
                              />
                            ))}
                          </div>
                        ) : (
                          <img
                            src="/theme/admin/assets/img/specialities/specialities-06.png"
                            alt="Album"
                            style={{ maxWidth: "100%", borderRadius: 8 }}
                          />
                        )}
                      </div>
                    ) : (
                      <div>Không có dữ liệu.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Delete Modal (reused) */}
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
                      <p className="mb-4">Are you sure want to delete?</p>
                      <button type="button" className="btn btn-primary">
                        Save
                      </button>
                      <span className="ml-10"> </span>
                      <button
                        type="button"
                        className="btn btn-danger"
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
      </div>
    </RequireAuth>
  );
}
