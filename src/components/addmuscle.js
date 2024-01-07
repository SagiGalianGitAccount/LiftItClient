import React, { Component, useState, useEffect } from "react";
import { backendUrl } from "./urlConnector";
import axios from "axios";

function AddMuscle(props) {
  const [muscleName, setMuscleName] = useState("");

  const add = () => {
    if (muscleName !== ""){
      props.setNextMuscleId((current) => current + 1);
      props.addMuscleLocaly(muscleName);
      props.setAdding(false);
      axios
        .post(backendUrl + "addmuscle", null, {
          params: {
            accountId: localStorage.getItem("id"),
            muscleName: muscleName,
            muscleId: props.nextMuscleId,
          },
        })
        .then((result) => {
          console.log(result.data);
        });
    }else{
      alert("Muslce name can not be empty")
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontWeight: "bold" }}>Add your muscles</h1>
      <h5>Examples for muscles are "Chest" "Back" and more !</h5>
      <input
        onChange={(e) => {
          setMuscleName(e.target.value);
        }}
        className="form-control"
        placeholder="Lift Name"
      />

      <button
        className="btn btn-primary m-2"
        onClick={() => {
          add();
        }}
      >
        Add
      </button>
      <button
        className="btn btn-danger m-2"
        onClick={() => {
          props.setAdding(false);
        }}
      >
        Cancel
      </button>
    </div>
  );
}

export default AddMuscle;
