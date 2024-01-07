import axios from "axios";
import React, { useState } from "react";
import { TiArrowUp, TiArrowDown } from "react-icons/ti";
import { backendUrl } from "./urlConnector";

const numbers = Array.from({ length: 1000 }, (_, index) => index + 1);

function EditWorkout({
  id,
  muscleId,
  exerciseId,
  updateWorkout,
  weights,
  reps,
  setInspecting,
  setViewingWorkout,
}) {
  const [setsCount, setSetsCount] = useState(weights.length);
  const [array, setArray] = useState(
    Array.from({ length: weights.length }, (_, index) => index + 1)
  );
  const [setsValues, setSetsValues] = useState(weights); // weights
  const [setsValues2, setSetsValues2] = useState(reps); // reps

  const updateWorkoutFunc = () => {
    updateWorkout(id, setsValues, setsValues2);
    axios
      .post(backendUrl + "updateWorkout", null, {
        params: {
          accountId: localStorage.getItem("id"),
          muscleId: muscleId,
          exerciseId: exerciseId,
          workoutId: id,
          newWeights: setsValues,
          newReps: setsValues2,
        },
      })
      .then((result) => {
        console.log(result.data);
      });
  };

  return (
    <div style={{backgroundColor: '#fffaff'}}>
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
            setSetsValues((current) => [...current, 1]);
            setSetsValues2((current) => [...current, 1]);
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
              setSetsValues((current) => current.slice(0, -1));
              setSetsValues2((current) => current.slice(0, -1));
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
            <div style={{ margin: 20 }}>
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
                value={setsValues[i - 1]}
                onChange={(e) => {
                  const newValue = Number(e.target.value);
                  setSetsValues((current) => {
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
                value={setsValues2[i - 1]}
                onChange={(e) => {
                  const newValue = Number(e.target.value);
                  setSetsValues2((current) => {
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
          updateWorkoutFunc();
          setInspecting(false);
          setViewingWorkout(false);
        }}
      >
        Update
      </button>
      <br />
      <br />
      <br />
    </div>
  );
}

export default EditWorkout;
