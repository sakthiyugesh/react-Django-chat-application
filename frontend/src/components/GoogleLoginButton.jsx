
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Initialize loading state
  const [errorMessage, setErrorMessage] = useState(""); // For error messages

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true); // Start loading when login begins
      const { access_token } = tokenResponse;

      try {
        const response = await axios.post(
          "http://localhost:8000/api/auth/google/",
          { token: access_token }
        );
        localStorage.setItem("authTokens", JSON.stringify(response.data));
        setLoading(false); // Stop loading after success
        navigate("/"); // Navigate to home
        window.location.reload();
      } catch (error) {
        setLoading(false); // Stop loading after error
        console.error("Error during login:", error);
        setErrorMessage("Failed to log in. Please try again.");
      }
    },
    onError: (error) => {
      setLoading(false); // Stop loading if Google login fails
      console.error("Login Failed:", error);
      setErrorMessage("Google login failed. Please try again.");
    },
  });

  return (
    <div>
      <button
        className="btn btn-success p-2"
        onClick={login}
        disabled={loading} // Disable button during loading
      >
        {loading ? (
          <span>
            <i
              className="spinner-border spinner-border-sm me-2"
              role="status"
            ></i>
            Loading...
          </span>
        ) : (
          <span>
            <i className="bi bi-google me-2"></i> Sign in with Google
          </span>
        )}
      </button>
      {errorMessage && <div className="text-danger mt-2">{errorMessage}</div>}
    </div>
  );
};

export default GoogleLoginButton;
