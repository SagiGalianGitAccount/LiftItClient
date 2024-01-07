import React, { Component, useState } from "react";
import axios from "axios";
import "../static/css/register.css";
import { backendUrl } from "../components/urlConnector";
import Avatar from "../static/images/avatar.svg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loader from "../components/loader";
import Lottie from 'lottie-react';
import workoutAnimation from '../static/animation/workout_animation.json';

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const checkExistance = () => {
    if (name.length <= 3 || password.length <= 3) {
      alert("Name and password must contain at least 4 chars");
    } else {
      setLoading(true);
      axios
        .get(backendUrl + "checkAccount", {
          params: {
            name: name,
            password: password,
          },
        })
        .then((result) => {
          if (result.data) {
            alert("The name of the account already exists");
          } else {
            createAccount();
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const createAccount = () => {
    setLoading(true);
    axios
      .post(backendUrl + "createAccount", null, {
        params: {
          name: name,
          password: password,
          email: email,
        },
      })
      .then((result) => {
        setLoading(false);
        alert(
          `Name: ${name} \nPassword: ${password}\nEmail: ${email}\nWe suggest you to take a picture of the details `
        );

        axios
          .get("https://hooks.zapier.com/hooks/catch/15102845/3uayrhe/")
          .then((result) => {
            console.log(result);
          })
          .catch((err) => {
            console.error(err);
          });
        navigate("/login");
      });
  };

  return (
    <div className="register-container-outer">
      <div className="register-container">
        <h1 style={{ paddingBottom: 20 }}>Register page</h1>
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
        <input
          style={{ maxWidth: 500 }}
          className="form-control"
          type="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="Email - Optional"
        />
        <button
          style={{ width: "100%", maxWidth: 500 }}
          className="btn btn-med btn-primary"
          onClick={checkExistance}
        >
          Register
        </button>
        <p>
          Have an account? login <Link to="/login">Here</Link>
        </p>
      </div>
      {loading && <Loader />}
    </div>
  );
}

export default Register;
