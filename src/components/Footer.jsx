"use client"
import React from 'react'

export default function Footer(){
  return (
    <footer className="footer inner-footer footer-info">
      <div className="footer-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="row">
                <div className="col-lg-3 col-md-3">
                  <div className="footer-widget footer-menu">
                    <h6 className="footer-title">Company</h6>
                    <ul>
                      <li><a href="#">About</a></li>
                      <li><a href="#">Features</a></li>
                      <li><a href="#">Works</a></li>
                      <li><a href="#">Careers</a></li>
                    </ul>
                  </div>
                </div>
                
                <div className="col-lg-3 col-md-3">
                  <div className="footer-widget footer-menu">
                    <h6 className="footer-title">Specialities</h6>
                    <ul>
                      <li><a href="#">Astrophotography</a></li>
                      <li><a href="#">Drone Photography</a></li>
                      <li><a href="#">Underwater Photography</a></li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-3 col-md-3">
                  <div className="footer-widget footer-menu">
                    <h6 className="footer-title">Utilites</h6>
                    <ul>
                      <li><a href="#">Pricing</a></li>
                      <li><a href="#">Contact</a></li>
                      <li><a href="#">Request A Quote</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-7">
              <div className="footer-widget">
                <h6 className="footer-title">Newsletter</h6>
                <p className="mb-2">Subscribe & Stay Updated from the Photography</p>
                <div className="subscribe-input">
                  <form action="#">
                    <input type="email" className="form-control" placeholder="Enter Email Address" />
                    <button type="submit" className="btn btn-md btn-primary-gradient d-inline-flex align-items-center"><i className="isax isax-send-25 me-1"></i>Send</button>
                  </form>
                </div>
                <div className="social-icon">
                  <h6 className="mb-3">Connect With Us</h6>
                  <ul>
                    <li><a href="#"><i className="fa-brands fa-facebook"></i></a></li>
                    <li><a href="#"><i className="fa-brands fa-x-twitter"></i></a></li>
                    <li><a href="#"><i className="fa-brands fa-instagram"></i></a></li>
                    <li><a href="#"><i className="fa-brands fa-linkedin"></i></a></li>
                    <li><a href="#"><i className="fa-brands fa-pinterest"></i></a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bg">
          <img src="/theme/assets/img/bg/footer-bg-01.png" alt="img" className="footer-bg-01" />
          <img src="/theme/assets/img/bg/footer-bg-02.png" alt="img" className="footer-bg-02" />
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <div className="copyright">
            <div className="copyright-text">
              <p className="mb-0">Copyright © 2025 Photography. All Rights Reserved</p>
            </div>
            <div className="copyright-menu">
              <ul className="policy-menu">
                <li><a href="#">Legal Notice</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Refund Policy</a></li>
              </ul>
            </div>
            <ul className="payment-method">
              <li><a href="#"><img src="/theme/assets/img/icons/card-01.svg" alt="Img" /></a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
