import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../auth/AuthContext";
import { Link } from "react-router-dom";

const RegisterComp = () => {
  let { RegisterUser } = useContext(AuthContext);
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [error, setError] = useState("");
  const [errorLength, setErrorlength] = useState("");

  useEffect(() => {
    validate();
  });

  const passwordF = (e) => {
    setPassword(e.target.value);
  };
  const passwordC = (e) => {
    setConfirmpassword(e.target.value);
  };

  const validate = () => {
    console.log(password);
    console.log(confirmpassword);
    if (password.length < 8) {
      setErrorlength("Password length must be atleast 8 characters");
    } else {
      setErrorlength("");
    }
    if (password !== confirmpassword) {
      setError("Password is not similiar!");
    } else {
      setError("");
    }
  };
  return (
    <div>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-5">
            <div className="wrap">
              {/* <div className="img" style={{backgroundColor:"aqua",height:"50px"}}></div> */}
              <div className="login-wrap p-4 p-md-5">
                <div className="d-flex">
                  <div className="">
                    <h3 className="mb-4 text-white">Register</h3>
                  </div>
                </div>
                <form
                  action="#"
                  className="signin-form"
                  id="login-myform"
                  onSubmit={RegisterUser}
                >
                  <div className="form-group mt-3">
                    <input
                      type="name"
                      className="form-control"
                      name="username"
                      required
                      placeholder="example@Matt"
                    />
                    <label className="form-control-placeholder" for="username">
                      Username
                    </label>
                  </div>
                  <div className="form-group mt-3">
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      required
                      placeholder="matt@gmail.com"
                    />
                    <label className="form-control-placeholder" for="username">
                      Email
                    </label>
                  </div>
                  <p className="password_error">{errorLength}</p>
                  <div className="form-group">
                    <input
                      id="password-field password"
                      type="password"
                      className="form-control"
                      name="password"
                      required
                      placeholder="Password"
                      onChange={passwordF}
                      value={password}
                    />
                    <label className="form-control-placeholder " for="password">
                      Password
                    </label>
                  </div>
                  <p className="password_error">{error}</p>

                  <div className="form-group">
                    <input
                      id="password-field in-between"
                      type="password"
                      className="form-control"
                      placeholder="Confirm password"
                      onChange={passwordC}
                      value={confirmpassword}
                    />
                    <label className="form-control-placeholder " for="password">
                      Password
                    </label>
                  </div>
                  <div className="form-group">
                    <button
                      type="submit"
                      className="form-control btn-primary rounded  px-3"
                    >
                      Sign Up
                    </button>
                  </div>
                </form>
                <p className="text-center">
                  Not a member?
                  <Link to="/login" data-toggle="tab" href="#signup">
                    Log In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterComp;
