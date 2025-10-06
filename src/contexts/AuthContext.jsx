"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

import { v4 as uuidv4 } from "uuid";
import moment from "moment";

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("user_token");
      const user = JSON.parse(localStorage.getItem("user"));
      if (token) {
        // Verify token with your API
        // const response = await fetch("/api/auth/verify", {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });
        // if (response.ok) {
        //   const userData = await response.json();
        //   setUser(userData.user);
        //   setIsAuthenticated(true);
        // } else {
        //   // Token is invalid, remove it
        //   localStorage.removeItem("user_token");
        //   setUser(null);
        //   setIsAuthenticated(false);
        // }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestTrace: uuidv4(),
          requestDateTime: moment().toISOString(),
          requestParameters: { email, password },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error?.responseStatus?.responseMessage || "Login failed"
        );
      }

      const data = await response.json();

      // Store token
      localStorage.setItem("user_token", data?.responseData?.accessToken);
      localStorage.setItem("user", JSON.stringify(data?.responseData?.user));

      // Update state
      setUser(data?.responseData?.user);
      setIsAuthenticated(true);

      return { success: true, user: data?.responseData?.user };
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("user_token");
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (userData) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      const data = await response.json();

      // Auto-login after registration
      localStorage.setItem("user_token", data.token);
      setUser(data.user);
      setIsAuthenticated(true);

      return { success: true, user: data.user };
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
