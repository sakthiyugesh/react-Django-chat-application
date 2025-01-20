import React, { useContext, useEffect } from "react";
import AuthContext from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import GoogleLoginButton from "../components/GoogleLoginButton";
import LoginComp from "../components/LoginComp";
import User from "../components/User";

const Login = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  // const [loading, setLoading] = useState(false);

  // Redirect if the user is already logged in
  useEffect(() => {
    if (user) {
      console.log("User already logged in:", user);
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="text-center">
        <h1 className="mb-4">Hey Welcome, </h1>
        {!user ? (
          <div>
            <p className="mb-3">
              Sign in to continue to Chat with Your Friends..!
            </p>
            <GoogleLoginButton />
            <LoginComp/>
            {/* <User/> */}
          </div>
        ) : (
          <p className="text-success">Redirecting to home...</p>
        )}
      </div>
    </div>
  );
};

export default Login;
