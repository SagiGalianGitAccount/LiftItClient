import React, { useState } from "react";
import Nav from "./nav";
import "../static/css/addworkout.css";
import { TiArrowUp, TiArrowDown } from "react-icons/ti";

const numbers = Array.from({ length: 1000 }, (_, index) => index + 1);

function AddWorkout(props) {
  const [setsCount, setSetsCount] = useState(3);
  const [array, setArray] = useState([1, 2, 3]);

  return (
    <div className="addworkout-container">
      <Nav />
      <br />
      <div style={{ textAlign: "center" }}>
        <h3>Add your workout here !</h3>
        <p>
          Enter here the number of sets you are doing today, for this current
          exercise, we will store the data and keep your consistancy
        </p>
      </div>
      <br />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            border: "2px solid #3f6ce1",
            padding: 3,
            width: "fit-content",
            height: "fit-content",
            borderRadius: 28,
            marginRight: 10,
          }}
          onClick={() => {
            setSetsCount((current) => current + 1);
            setArray((current) => [...current, array[array.length - 1] + 1]);
            props.setSetsValues((current) => [...current, 1]);
            props.setSetsValues2((current) => [...current, 1]);
          }}
        >
          <TiArrowUp color="#3f6ce1" size={35} />
        </div>
        <h1>{setsCount}</h1>
        <div
          style={{
            border: "2px solid #3f6ce1",
            padding: 3,
            width: "fit-content",
            height: "fit-content",
            borderRadius: 28,
            marginLeft: 10,
          }}
          onClick={() => {
            if (setsCount > 1) {
              setSetsCount((current) => current - 1);
              setArray((current) => current.slice(0, -1));
              props.setSetsValues((current) => current.slice(0, -1));
              props.setSetsValues2((current) => current.slice(0, -1));
            }
          }}
        >
          <TiArrowDown color="#3f6ce1" size={35} />
        </div>
      </div>
      <div style={{ margin: 20 }}>
        {array.map((i) => (
          <div key={i}>
            <br />
            <div style={{margin: 20}}>
              <h1>Set number {i}</h1>
              {i == 1 && (
                <div>
                  <h6 style={{ fontWeight: "bold" }}>
                    This is your heaviest set
                  </h6>
                  <p>This set will be included in the progress calculation</p>
                </div>
              )}
            </div>
            <div className="sets-container">
              <label style={{ marginRight: 10 }} htmlFor="weight">
                Weight
              </label>
              <br />
              <select
                name="weight"
                value={props.setsValues[i - 1]}
                onChange={(e) => {
                  const newValue = Number(e.target.value);
                  props.setSetsValues((current) => {
                    const newValues = [...current];
                    newValues[i - 1] = newValue;
                    return newValues;
                  });
                }}
              >
                {numbers.map((number) => (
                  <option key={number} value={number}>
                    {number}
                  </option>
                ))}
              </select>
              <br />
              <label style={{ marginRight: 10 }} htmlFor="reps">
                Repetitions
              </label>
              <br />
              <select
                name="reps"
                value={props.setsValues2[i - 1]}
                onChange={(e) => {
                  const newValue = Number(e.target.value);
                  props.setSetsValues2((current) => {
                    const newValues = [...current];
                    newValues[i - 1] = newValue;
                    return newValues;
                  });
                }}
              >
                {numbers.map((number) => (
                  <option key={number} value={number}>
                    {number}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
      <button
        className="btn btn-primary m-2"
        onClick={() => {
          props.addWorkout();
          props.selfClosing(false);
        }}
      >
        Add Workout
      </button>
      <button
        className="btn btn-danger m-5"
        onClick={() => {
          props.selfClosing(false);
        }}
      >
        Close
      </button>
    </div>
  );
}

export default AddWorkout;
