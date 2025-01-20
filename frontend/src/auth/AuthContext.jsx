// AuthContext.js

import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  let navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const tokens = localStorage.getItem("authTokens");
    return tokens ? jwtDecode(JSON.parse(tokens).access) : null;
  });
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  const loginUser = (tokens) => {
    setAuthTokens(tokens);
    setUser(jwtDecode(tokens.access));
    localStorage.setItem("authTokens", JSON.stringify(tokens));
    console.log("redirecting to home");
  };

  let RegisterUser = async (e) => {
    e.preventDefault();

    let response = await fetch("http://127.0.0.1:8000/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: e.target.email.value,
        username: e.target.username.value,
        password: e.target.password.value,
      }),
    });

    let data = await response.json();
    console.log(data);
    navigate('/login')

    if (response.status !== 201) {
      alert("Not register something Wrong..!");
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{ user, authTokens, loginUser, logoutUser, RegisterUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
