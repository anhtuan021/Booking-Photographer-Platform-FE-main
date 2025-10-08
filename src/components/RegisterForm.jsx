"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setCfPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!name || !email || !role || !password || !confirm_password) {
      setError("Please fill all required fields");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }
    if (password !== confirm_password) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      console.log({ name, email, role, password });

      const res = await fetch(`/api/auth/register/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestTrace: uuidv4(),
          requestDateTime: moment().toISOString(),
          requestParameters: {
            name,
            email,
            role,
            password,
          },
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.responseStatus?.responseMessage || "Registration failed"
        );
      }
      if (role == "PHOTOGRAPHER")
        return router.push(
          "https://booking-admin-ruddy-phi.vercel.app/login?id=" +
            data?.responseData?.user?.id
        );
      else router.push("/auth/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="account-content">
            <div className="row align-items-center justify-content-center">
              <div className="col-md-7 col-lg-6 login-left d-none d-lg-block">
                <img
                  src="/theme/assets/img/login-banner.png"
                  className="img-fluid"
                  alt="Register"
                />
              </div>
              <div className="col-md-12 col-lg-6 login-right">
                <div className="login-header">
                  <h3>Register</h3>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Full name</label>
                    <input
                      placeholder="Nguyen Van Anh"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">E-mail</label>
                    <input
                      placeholder="vananh@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <fieldset>
                      <div className="pass-group">
                        <div style={{ textAlign: "left" }}>
                          <input
                            value="CUSTOMER"
                            type="radio"
                            name="role"
                            onChange={(e) => setRole(e.target.value)}
                            id="customer"
                          />
                          <label
                            htmlFor="customer"
                            style={{ marginLeft: "20px" }}
                          >
                            Customer
                          </label>
                        </div>
                        <div style={{ textAlign: "left" }}>
                          <input
                            value="PHOTOGRAPHER"
                            type="radio"
                            onChange={(e) => setRole(e.target.value)}
                            id="photographer"
                            name="role"
                          />
                          <label
                            htmlFor="photographer"
                            style={{ marginLeft: "20px" }}
                          >
                            Photographer
                          </label>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <div className="pass-group">
                      <input
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        className="form-control pass-input"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <div className="pass-group">
                      <input
                        placeholder="Confirm password"
                        value={confirm_password}
                        onChange={(e) => setCfPassword(e.target.value)}
                        type="password"
                        className="form-control pass-input"
                      />
                    </div>
                  </div>
                  {error && <div className="alert alert-danger">{error}</div>}
                  <div className="mb-3">
                    <button
                      className="btn btn-primary-gradient w-100"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "Create account"}
                    </button>
                  </div>
                  <div className="account-signup mt-3">
                    <p>
                      Already have an account ?{" "}
                      <a href="/auth/login">Sign in</a>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
