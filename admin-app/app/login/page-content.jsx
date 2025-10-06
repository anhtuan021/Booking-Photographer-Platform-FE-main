"use client";
import { useState, useEffect } from "react";
import RedirectIfAuth from "../../components/RedirectIfAuth";
import { useRouter, useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAuth } from "../../store/authSlice";

import { v4 as uuidv4 } from "uuid";
import moment from "moment";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const dispatch = useDispatch();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    let valid = true;
    setEmailError("");
    setPasswordError("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email");
      valid = false;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    }
    if (!valid) return;
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const api = `/api/v1/auth/login`;
      const payload = {
        requestTrace: uuidv4(),
        requestDateTime: moment().toISOString(),
        requestParameters: {
          email,
          password,
        },
      };

      const res = await fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "*/*" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          data?.responseStatus?.responseMessage ||
            `Request failed: ${res.status}`
        );
      }

      const data = await res.json().catch(() => null);

      const token = data?.responseData?.accessToken || null;
      const user = data?.responseData?.user || null;
      if (token && user) {
        try {
          localStorage.setItem("admin_token", token);
          localStorage.setItem("admin_user", JSON.stringify(user));
          localStorage.setItem("admin_login_response", JSON.stringify(data));
          dispatch(setAuth({ token, user }));
        } catch (e) {
          /* ignore */
        }
      }

      if (user.role === "ADMIN") {
        router.push("/");
      } else {
        router.push("/profile");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <RedirectIfAuth>
      <div className="main-wrapper login-body">
        <div className="login-wrapper">
          <div className="container">
            <div className="loginbox">
              <div className="login-left">
                <img
                  className="img-fluid"
                  src="https://photographer-booking.vercel.app/theme/assets/img/logo-1.png"
                  alt="Logo"
                />
              </div>
              <div className="login-right">
                <div className="login-right-wrap">
                  <h1>Login</h1>
                  <p className="account-subtitle">Access to our dashboard</p>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <input
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailError("");
                        }}
                        className="form-control"
                        type="text"
                        placeholder="Email"
                      />
                      {emailError && (
                        <div className="text-danger small mt-1">
                          {emailError}
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <input
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setPasswordError("");
                        }}
                        className="form-control"
                        type="password"
                        placeholder="Password"
                      />
                      {passwordError && (
                        <div className="text-danger small mt-1">
                          {passwordError}
                        </div>
                      )}
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="mb-3">
                      <button
                        className="btn btn-primary w-100"
                        type="submit"
                        disabled={loading || !!emailError || !!passwordError}
                      >
                        {loading ? "Logging in..." : "Login"}
                      </button>
                    </div>
                  </form>

                  <div className="text-center forgotpass">
                    <a href="#">Forgot Password?</a>
                  </div>
                  <div className="text-center dont-have">
                    Don’t have an account? <a href="./register">Register</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RedirectIfAuth>
  );
}
