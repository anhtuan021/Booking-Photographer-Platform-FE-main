"use client";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import RequireAuth from "../../components/RequireAuth";
import { useEffect, useState, useRef } from "react";
import moment from "moment";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dtRef = useRef(null);
  const [viewCustomer, setViewCustomer] = useState(null);

  // Fetch customers
  useEffect(() => {
    async function fetchCustomers() {
      try {
        setLoading(true);
        setError(null);
        const api = `/api/v1/customers`;
        const res = await fetch(api, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            Authorization: `${localStorage.getItem("admin_token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch customers");
        const data = await res.json();
        setCustomers(data?.responseData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (!dtRef.current) {
      dtRef.current = $("#customers-table").DataTable({
        autoWidth: false,
      });
    }
  }, []);
  useEffect(() => {
    if (dtRef.current) {
      dtRef.current.clear();
      if (customers && customers.length) {
        customers.forEach((item, idx) => {
          dtRef.current.row.add([
            idx + 1,
            `<a href="#" class="customer-name-link" data-index="${idx}">${
              item.firstName + " " + item.lastName
            }</a>`,
            item.address || "-",
            item.email ? item.email : "-",
            item.phone ? item.phone : "-",
            item.status || "-",
            `
              <div class="status-toggle">
                <input type="checkbox" id="status_${idx}" class="check" ${
              item.status === "ACTIVE" ? "checked" : ""
            }>
                <label for="status_${idx}" class="checktoggle">checkbox</label>
              </div>
            `,
          ]);
        });
      }
      dtRef.current.draw(false);
    }
  }, [customers]);
  // View details modal
  useEffect(() => {
    if (dtRef.current) {
      $("#customers-table").off("click", ".customer-name-link");
      $("#customers-table").on("click", ".customer-name-link", function (e) {
        e.preventDefault();
        const idx = $(this).data("index");
        if (customers[idx]) {
          setViewCustomer(customers[idx]);
          const modal = document.getElementById("view_customer_modal");
          if (modal) {
            const modalInstance =
              window.bootstrap.Modal.getOrCreateInstance(modal);
            modalInstance.show();
          }
        }
      });
    }
  }, [customers]);

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
                    <span> List of Customers </span>
                  </h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item active">
                      Home{" "}
                      <i
                        className="fa fa-angle-double-right"
                        aria-hidden="true"
                      ></i>{" "}
                      <a href="#">Customers</a>
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
                        id="customers-table"
                        className=" table table-hover table-center mb-0"
                      >
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Customers Name</th>
                            <th>Address</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Account Status</th>
                            <th>Active</th>
                          </tr>
                        </thead>
                        <tbody> </tbody>
                      </table>
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
