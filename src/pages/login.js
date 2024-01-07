import React, { Component, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../static/css/login.css";
import axios from "axios";
import { backendUrl } from "../components/urlConnector";
import Avatar from "../static/images/avatar.svg";
import { Link } from "react-router-dom";
import Loader from "../components/loader";
import Lottie from 'lottie-react';
import workoutAnimation from '../static/animation/workout_animation.json';

function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [inForgot, setInForgot] = useState(false);
  const [email, setEmail] = useState(false);

  useEffect(() => {
    localStorage.setItem("rememberMe", "false");
  }, []);

  const isValidEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  const checkAccount = () => {
    setLoading(true);
    axios
      .get(backendUrl + "checkAccount", {
        params: {
          name: name,
          password: password,
        },
      })
      .then((result) => {
        setLoading(false);
        if (result.data) {
          console.log("user exists");
          localStorage.setItem("id", result.data._id);
          localStorage.setItem("userName", result.data.name);
          navigate("/home");
        } else {
          alert("user is not exist");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="login-container-outer">
      <div className="login-container">
        <h1 style={{ paddingBottom: 20 }}>Login page</h1>
        {/* <img width={120} height={120} src={Avatar} /> */}
        <Lottie style={{width: 220}} animationData={workoutAnimation} />
        <input
          style={{ maxWidth: 500 }}
          className="form-control"
          onChange={(e) => {
            setName(e.target.value);
          }}
          placeholder="Username"
        />
        <input
          type="password"
          style={{ maxWidth: 500 }}
          className="form-control"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="Password"
        />
        <div
          style={{
            width: "100%",
            maxWidth: 500,
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
          }}
        >
          <label htmlFor="checkbox">Remember Me</label>
          <input
            style={{ width: 20, height: 20 }}
            name="checkbox"
            type="checkbox"
            onClick={(e) => {
              localStorage.setItem("rememberMe", e.target.checked);
            }}
          />
        </div>
        <button
          style={{ width: "100%", maxWidth: 500 }}
          className="btn btn-med btn-primary"
          onClick={(e) => {
            // localStorage.setItem("token", "token");
            // navigate("/home");
            checkAccount();
          }}
        >
          Login
        </button>
        <p>
          Don't have an account? click <Link to="/register">Here</Link>
        </p>
        <button
          className="btn btn-primary m-2 btn-sm"
          onClick={() => {
            setInForgot((current) => !current);
          }}
        >
          Forgot my password
        </button>
      </div>

      {inForgot && (
        <div className="forgot-psw-container">
          <h3>
            To restore your password, please fill in the email address you
            provided during account creation.
          </h3>
          <br />
          <input
            className="form-control"
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <br />
          <button
            className="btn btn-primary"
            style={{ marginRight: 20 }}
            onClick={() => {
              if (isValidEmail(email)) {
                axios
                  .post(backendUrl + "forgotPassword", null, {
                    params: {
                      email: email,
                    },
                  })
                  .then((result) => {
                    if (result.data == "email exists") {
                      axios
                        .get(
                          "https://hooks.zapier.com/hooks/catch/15102845/3ufn4ut/"
                        )
                        .then((result) => {
                          console.log(result);
                          alert(
                            "Your password will be sent to your email, it might take some time\nNotice that you can change your password in the settings page in the website"
                          );
                          setInForgot(false);
                        })
                        .catch((err) => {
                          console.error(err);
                          alert(
                            "Your password will be sent to your email, it might take some time\nNotice that you can change your password in the settings page in the website"
                          );
                          setInForgot(false);
                        });
                    } else {
                      alert(
                        "Your email is not in our database.\nMake sure it is your correct email you gave us in the creation of your account\nif you dont remember feel free to contact our team in the email - liftit.contact@gmail.com"
                      );
                    }
                  });
              } else {
                alert("Email is not valid");
              }
            }}
          >
            Done
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              setInForgot(false);
            }}
          >
            Close
          </button>
        </div>
      )}
      {loading && <Loader />}
    </div>
  );
}

export default Login;
