import React, { Component, useEffect, useState } from "react";
import "../static/css/settings.css";
import { backendUrl } from "../components/urlConnector";
import axios from "axios";
import Loader from "../components/loader";

function Settings({ setInSettings }) {
  const [changeName, setChangeName] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [email, setEmail] = useState("");
  const [changeEmail, setChangeEmail] = useState(false);

  const isValidEmail = () => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  const checkExistance = (nameFunc, passwordFunc) => {
    setLoading(true);
    return axios
      .get(backendUrl + "checkAccount", {
        params: {
          name: nameFunc,
          password: passwordFunc,
        },
      })
      .then((result) => {
        setLoading(false);
        if (result.data) {
          return true; // already exists
        } else {
          return false; // not exist yet
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateEmail = () => {
    axios
      .post(backendUrl + "updateEmail", null, {
        params: {
          accountId: localStorage.getItem("id"),
          newEmail: email,
        },
      })
      .then((result) => {
        console.log(result.data);
        localStorage.setItem("userEmail", email);
        setLoading(false);
        alert("Your new email: " + email);
        setInSettings(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const changeAccountName = () => {
    setLoading(true);
    axios
      .post(backendUrl + "renameAccount", null, {
        params: {
          accountId: localStorage.getItem("id"),
          newName: newName,
        },
      })
      .then((result) => {
        console.log(result.data);
        localStorage.setItem("userName", newName);
        setLoading(false);
        alert("Your new name: " + newName);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const changeAccountPassword = () => {
    setLoading(true);
    axios
      .post(backendUrl + "changeAccountPassword", null, {
        params: {
          accountId: localStorage.getItem("id"),
          newPassword: newPassword,
        },
      })
      .then((result) => {
        console.log(result.data);
        setLoading(false);
        alert("Your new Password: " + newPassword);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const checkAccount = () => {
    setLoading(true);
    return axios
      .get(backendUrl + "checkAccount", {
        params: {
          name: localStorage.getItem("userName"),
          password: password,
        },
      })
      .then((result) => {
        setLoading(false);
        if (result.data) {
          return true;
        } else {
          return false;
        }
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  };

  return (
    <div className="settings-container">
      <div style={{ textAlign: "center" }}>
        <h1>Settings Page</h1>
      </div>
      <h2>Name: {localStorage.getItem("userName")}</h2>
      <button
        className="btn btn-primary m-2"
        onClick={() => {
          setChangeName((current) => !current);
          setChangePassword(false);
          setChangeEmail(false);
          setPassword("");
          setNewName("");
        }}
      >
        Edit
      </button>
      {changeName && (
        <div>
          <input
            className="form-control"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <input
            className="form-control"
            placeholder="New Name"
            onChange={(e) => {
              setNewName(e.target.value);
            }}
          />
          <button
            className="btn btn-success m-2"
            onClick={() => {
              if (newName.length > 3) {
                checkAccount().then((result) => {
                  console.log(result);
                  if (result) {
                    checkExistance(newName, password).then((result) => {
                      if (result) {
                        alert(
                          "Name or password are not availble try another one"
                        );
                      } else {
                        changeAccountName();
                      }
                    });
                  } else {
                    alert("Password does not match");
                  }
                });
              } else {
                alert("Your new name must contain at least 4 chars");
              }
            }}
          >
            Change
          </button>
        </div>
      )}
      <h2>Password: xxxxxxx</h2>
      <button
        className="btn btn-primary m-2"
        onClick={() => {
          setChangePassword((current) => !current);
          setChangeName(false);
          setChangeEmail(false);
          setPassword("");
        }}
      >
        Edit
      </button>
      {changePassword && (
        <div>
          <input
            className="form-control"
            placeholder="Old password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <input
            className="form-control"
            placeholder="New Password"
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
          />
          <button
            className="btn btn-success m-2"
            onClick={() => {
              if (newPassword.length > 3) {
                checkAccount().then((result) => {
                  if (result) {
                    checkExistance(localStorage.getItem('userName'), newPassword).then(result => {
                      if (result){
                        alert('Name or password are not availble try another one')
                      }else{
                        changeAccountPassword();
                      }
                    })
                  } else {
                    alert("Password does not match");
                  }
                });
                /*

                checkAccount().then((result) => {
                  console.log(result);
                  if (result) {
                    checkExistance(newName, password).then(result => {
                      if (result){
                        alert('Name or password are not availble try another one')
                      }else{
                         changeAccountName();
                      }
                    })
                   
                  } else {
                    alert("Password does not match");
                  }
                });

                */
              } else {
                alert("New password must contain at least 3 chars");
              }
            }}
          >
            Change
          </button>
        </div>
      )}
      {localStorage.getItem("userEmail") === "" ? (
        <div>
          <h1>Your email is not connected</h1>
          <p>
            We recommend that you provide us with your email address. In the
            event that you forget your password, we can help you regain access
            to your account. Rest assured that your email will only be used for
            account-related purposes and will not be shared with any third
            parties.
          </p>
          <input
            placeholder="Email"
            className="form-control"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <button
            className="btn btn-success m-2"
            onClick={() => {
              if (isValidEmail()) {
                updateEmail();
              } else {
                alert("Email is not valid");
              }
            }}
          >
            Done
          </button>
        </div>
      ) : (
        <div>
          <h2>Email: {localStorage.getItem("userEmail")}</h2>
          <button
            className="btn btn-primary m-2"
            onClick={() => {
              setChangeEmail((current) => !current);
              setChangeName(false);
              setChangePassword(false);
              setPassword("");
              setEmail("");
            }}
          >
            Edit
          </button>
          {changeEmail && (
            <div>
              <input
                className="form-control"
                placeholder="Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <input
                className="form-control"
                placeholder="New email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <button
                className="btn btn-success m-2"
                onClick={() => {
                  if (isValidEmail()) {
                    checkAccount().then((result) => {
                      console.log(result);
                      if (result) {
                        updateEmail();
                      } else {
                        alert("Password does not match");
                      }
                    });
                  } else {
                    alert("Email is not valid");
                    console.log(email);
                  }
                }}
              >
                Change
              </button>
            </div>
          )}
        </div>
      )}
      <br />
      <h3>
        Your current plan will expire in{" "}
        {localStorage.getItem("inTrial") === "true"
          ? 60 - localStorage.getItem("timePassed")
          : 30 - localStorage.getItem("timePassed")}{" "}
        days.
      </h3>

      <button
        className="btn btn-danger m-2"
        onClick={() => {
          setInSettings(false);
        }}
      >
        Close
      </button>
      {loading && <Loader />}
    </div>
  );
}

export default Settings;
