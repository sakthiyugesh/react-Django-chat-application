import React, { useContext, useState } from "react";
import AuthContext from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const LoginComp = () => {
  // let { LoginUser } = useContext(AuthContext);
  // let [authToken, setAuthtokens] = useState(() =>
  //   localStorage.getItem("authTokens")
  //     ? JSON.parse(localStorage.getItem("authTokens"))
  //     : null
  // );
  let navigate = useNavigate();
  let LoginJwtUser = async (e) => {
    e.preventDefault();

    let response = await fetch("http://127.0.0.1:8000/api/login/", {
      method: "POST",
      headers: {
        // Authorization: `Bearer ${parsedData.tokens.access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: e.target.password.value,
        username: e.target.username.value,
      }),
    });

    let data = await response.json();
    console.log(data);
    localStorage.setItem("authTokens", JSON.stringify(data));
    navigate("/");
    window.location.reload(true);
  };
  return (
    <div>
      <div className="container">
        <div className="row justify-content-center ">
          <div className="col-md-7 col-lg-5">
            <div className="wrap">
              <div className="img">
                <img
                  src="https://blog.fintso.com/content/images/size/w2000/2020/06/blog-11.png"
                  style={{ maxHeight: "300px" }}
                  alt=""
                  className="img-2"
                />
              </div>
              <div className="login-wrap p-4 p-md-5">
                <form
                  action="#"
                  className="signin-form"
                  onSubmit={LoginJwtUser}
                >
                  <div className="form-group mt-3">
                    <input
                      type="email"
                      className="form-control"
                      name="username"
                      required
                      placeholder="example@gmail.com"
                    />
                    <label className="form-control-placeholder" for="username">
                      Email
                    </label>
                  </div>
                  <div className="form-group">
                    {/* <p className="password_error">{passwordWrong}</p> */}
                    <input
                      id="password-field"
                      type="password"
                      className="form-control"
                      name="password"
                      placeholder="Password"
                      required
                    />
                    <label className="form-control-placeholder" for="password">
                      Password
                    </label>
                    {/* <span
                      toggle="#password-field"
                      className="fa fa-fw fa-eye field-icon toggle-password"
                    ></span> */}
                  </div>
                  <div className="form-group d-flex justify-content-center">
                    <button
                      type="submit"
                      className=" form-control  btn-primary rounded  px-3"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
                <div className="login-bottom d-flex justify-content-around p-1 ">
                  <p>
                    {" "}
                    <Link to="/password_reset">Forgot Password? </Link>
                  </p>
                  <p className="">
                    Not a member?
                    <Link to="/register" data-toggle="tab" href="#signup">
                      Register
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComp;
