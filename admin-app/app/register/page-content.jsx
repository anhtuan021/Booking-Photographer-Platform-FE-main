"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import RedirectIfAuth from "../../components/RedirectIfAuth";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) {
      setError("Please fill all required fields");
      return;
    }
    if (password !== password2) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE || "";
      const api = `/api/v1/auth/register/admin`;
      const payload = {
        requestTrace: uuidv4(),
        requestDateTime: moment().toISOString(),
        requestParameters: {
          name,
          email,
          password,
          confirmPassword: password2,
        },
      };

      const res = await fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          data?.responseStatus?.responseMessage ||
            `Request failed: ${res.status}`
        );
      }

      // success: redirect to admin login page
      router.push("/login");
    } catch (err) {
      setError(err.message || "Registration failed");
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
                  <h1>Register</h1>
                  <p className="account-subtitle">Access to our dashboard</p>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-control"
                        type="text"
                        placeholder="Name"
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                        type="email"
                        placeholder="Email"
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                        type="password"
                        placeholder="Password"
                        minLength={6}
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        className="form-control"
                        type="password"
                        placeholder="Confirm Password"
                        minLength={6}
                      />
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="mb-3">
                      <button
                        className="btn btn-primary w-100"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? "Registering..." : "Register"}
                      </button>
                    </div>
                  </form>

                  <div className="text-center dont-have">
                    Already have an account? <a href="./login">Login</a>
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
