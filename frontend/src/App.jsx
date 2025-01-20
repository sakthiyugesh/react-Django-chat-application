// App.js

import React, { useContext, useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginButton from "./components/GoogleLoginButton";
import AuthContext, { AuthProvider } from "./auth/AuthContext";
import { use } from "react";
import Login from "./pages/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ChatDetailView from "./pages/ChatDetailView";
import RegisterComp from "./components/RegisterComp";

const App = () => {
  return (
    <>
      <GoogleOAuthProvider clientId="33308004104-32qvgj1m1knvigjb5giio10n1gdlshr0.apps.googleusercontent.com">
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" exact Component={Home}></Route>
              <Route path="login/" Component={Login}></Route>
              <Route path="register/" Component={RegisterComp}></Route>
              <Route
                path="chat/:sender/:receiver/:name"
                Component={ChatDetailView}
              ></Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </>
  );
};

export default App;
