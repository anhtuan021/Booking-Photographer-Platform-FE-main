"use client";
import React from "react";
import Link from "next/link";
export default function PhotographerCard({ photographer }) {
  return (
    <div className="card">
      <div className="card-img card-img-hover">
        <a href={`./photographer/${photographer.id}`}>
          <img
            src={
              photographer.avatarUrl
                ? photographer.avatarUrl
                : photographer.randomImage
            }
            alt=""
          />
        </a>
        <div className="grid-overlay-item d-flex align-items-center justify-content-between">
          <span className="badge bg-orange">
            <i className="fa-solid fa-star me-1"></i>5.0
          </span>
          <a href="javascript:void(0)" className="fav-icon">
            <i className="fa fa-heart"></i>
          </a>
        </div>
      </div>
      <div className="card-body p-0">
        <div className="d-flex active-bar align-items-center justify-content-between p-3">
          <a href="#" className="text-indigo fw-medium fs-14">
            Event
          </a>
          <span className="badge bg-success-light d-inline-flex align-items-center">
            <i className="fa-solid fa-circle fs-5 me-1"></i>
            Available
          </span>
        </div>
        <div className="p-3 pt-0">
          <div className="doctor-info-detail mb-3 pb-3">
            <h3 className="mb-1">
              <a href={`./photographer/${photographer.id}`}>
                {" "}
                {photographer.businessName || `Photographer ${photographer.id}`}
              </a>
            </h3>
            <div className="d-flex align-items-center">
              <p className="d-flex align-items-center mb-0 fs-14">
                <i className="isax isax-location me-2"></i>
                {photographer.locationAddress || "-"}
              </p>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <p className="mb-1">Consultation Fees</p>
              <h3 className="text-orange">
                {photographer.minPrice.toLocaleString("vi-VN")}
              </h3>
            </div>
            <a
              href={`./booking/${photographer.id}`}
              className="btn btn-md btn-dark d-inline-flex align-items-center rounded-pill"
            >
              <i className="isax isax-calendar-1 me-2"></i>
              Book Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
