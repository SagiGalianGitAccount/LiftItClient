import React, { useEffect, useState } from "react";
import Nav from "../components/nav";
import Workout from "./workout";
import "../static/css/inspectingExercise.css";
import axios from "axios";
import { backendUrl } from "./urlConnector";
import Chart from "./lineChart";
import AreaChart from "./areaChart";
import ColumnChart from "./columnChart";
import { v4 as uuidv4 } from "uuid";
import { RiDeleteBin5Line, RiPencilLine } from "react-icons/ri";
import { IoIosAlert } from "react-icons/io";
import AddWorkout from "./addWorkout";
import Loader from "./loader";
import { IoArrowForwardOutline } from "react-icons/io5";
import { VscAdd } from "react-icons/vsc";
import { HiArrowPath } from "react-icons/hi2";

const id = uuidv4();

function InspectingExercise(props) {
  const [setsValues, setSetsValues] = useState([1, 1, 1]);
  const [setsValues2, setSetsValues2] = useState([1, 1, 1]);
  const [workouts, setWorkouts] = useState([]);
  const [chartMode, setChartMode] = useState(1);
  const [workoutId, setWorkoutId] = useState(id);
  const [adding, setAdding] = useState(false);
  const [viewingWorkout, setViewingWorkout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    getWorkouts();
  }, []);

  const updateWorkout = (workoutId, newWeights, newReps) => {
    const newWorkouts = workouts.map((item) => {
      if (item.workoutId === workoutId) {
        return {
          ...item,
          sets: {
            weights: newWeights,
            reps: newReps,
          },
        };
      }
      return item;
    });
    console.log(newWorkouts);
    setWorkouts(newWorkouts);
  };

  const changeChartMode = () => {
    if (chartMode === 3) {
      setChartMode(1);
    } else {
      setChartMode((current) => current + 1);
    }
  };
  const getWorkouts = () => {
    setLoading(true);
    axios
      .get(backendUrl + "getExercise", {
        params: {
          accountId: localStorage.getItem("id"),
          muscleId: props.muscleId,
          exerciseId: props.exerciseId,
        },
      })
      .then((result) => {
        setWorkouts(result.data.workouts);
        setLoading(false);
      });
  };

  const addWorkout = () => {
    setSetsValues([1, 1, 1]);
    setSetsValues2([1, 1, 1]);
    setWorkouts((current) => [
      ...current,
      {
        sets: {
          weights: setsValues,
          reps: setsValues2,
        },
        date: Date.now(),
        workoutId: workoutId,
      },
    ]);

    axios
      .post(backendUrl + "addWorkout", null, {
        params: {
          accountId: localStorage.getItem("id"),
          muscleId: props.muscleId,
          exerciseId: props.exerciseId,
          weights: setsValues,
          reps: setsValues2,
          workoutId: workoutId,
        },
      })
      .then((result) => {
        console.log(result.data);
      });
    const newId = uuidv4();
    setWorkoutId(newId);
  };

  const deleteWorkout = (workoutId) => {
    setWorkouts((current) =>
      current.filter((obj) => obj.workoutId !== workoutId)
    );

    axios
      .post(backendUrl + "deleteWorkout", null, {
        params: {
          accountId: localStorage.getItem("id"),
          muscleId: props.muscleId,
          exerciseId: props.exerciseId,
          workoutId: workoutId,
        },
      })
      .then((result) => {
        console.log(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div
      className="inspecting-exercise-container"
      style={{ overflowY: `${viewingWorkout ? "hidden" : "scroll"}` }}
    >
      <Nav />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 20,
        }}
      >
        <div id="scroller">
          <h1>{props.name}</h1>
        </div>
        <div className="buttons-inspecting-exercise">
          <RiDeleteBin5Line
            id="clickable"
            color="#d8315b"
            size={35}
            style={{
              border: "2px solid #d8315b",
              padding: 5,
              borderRadius: 28,
            }}
            onClick={() => {
              const confirmed = window.confirm(
                "Are you sure you want to delete this exercise? \nThe data of this exercise will be removed"
              );
              if (confirmed) {
                props.setInspecting(false);
                props.deleteExercise(props.exerciseId);
              }
            }}
          />

          {workouts.length > 1 && (
            <HiArrowPath
              id="clickable"
              size={35}
              color="gray"
              style={{
                border: "2px solid gray",
                padding: 5,
                borderRadius: 28,
              }}
              onClick={changeChartMode}
            />
          )}
          <VscAdd
            id="clickable"
            onClick={() => {
              setAdding(true);
            }}
            size={35}
            color="#3f6ce1"
            style={{
              border: "2px solid #3f6ce1",
              padding: 5,
              borderRadius: 28,
            }}
          />
          <RiPencilLine
            id="clickable"
            color="gray"
            size={35}
            style={{
              border: "2px solid gray",
              padding: 5,
              borderRadius: 28,
            }}
            onClick={() => {
              setEditing((current) => !current);
            }}
          />
          <IoArrowForwardOutline
            id="clickable"
            color="green"
            size={35}
            style={{
              border: "2px solid green",
              padding: 5,
              borderRadius: 28,
            }}
            onClick={() => {
              props.setInspecting(false);
            }}
          />
        </div>
      </div>
      {editing && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <input
            value={newName}
            className="form-control"
            placeholder="Rename the current Exercise"
            style={{ width: "95%" }}
            onChange={(e) => {
              setNewName(e.target.value);
            }}
          />
          <button
            className="btn btn-primary"
            onClick={() => {
              props.renameExercise(props.exerciseId, newName);
              axios
                .post(backendUrl + "renameExercise", null, {
                  params: {
                    accountId: localStorage.getItem("id"),
                    muscleId: props.muscleId,
                    exerciseId: props.exerciseId,
                    newName: newName,
                  },
                })
                .then((result) => {
                  console.log(result.data);
                });
            }}
          >
            Change
          </button>
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          padding: 10,
        }}
      ></div>
      {workouts.length > 1 && !adding && !viewingWorkout ? (
        <div>
          {chartMode == 2 && <Chart workouts={workouts} />}
          {chartMode == 1 && <AreaChart workouts={workouts} />}
          {chartMode == 3 && <ColumnChart workouts={workouts} />}
        </div>
      ) : (
        <div style={{ padding: 30, textAlign: "center" }}>
          <h3>
            <IoIosAlert size={30} /> To see your progress you need more than 1
            workout
          </h3>
        </div>
      )}

      {!adding &&
        workouts
          .slice()
          .reverse()
          .map((workout) => (
            <Workout
              key={workout.workoutId}
              date={workout.date}
              reps={workout.sets.reps}
              weights={workout.sets.weights}
              id={workout.workoutId}
              selfRemove={deleteWorkout}
              setViewingWorkout={setViewingWorkout}
              exerciseId={props.exerciseId}
              muscleId={props.muscleId}
              updateWorkout={updateWorkout}
            ></Workout>
          ))}

      {adding && (
        <AddWorkout
          addWorkout={addWorkout}
          setSetsValues={setSetsValues}
          setSetsValues2={setSetsValues2}
          setsValues={setsValues}
          setsValues2={setsValues2}
          selfClosing={setAdding}
        />
      )}
      {loading && <Loader />}
    </div>
  );
}

export default InspectingExercise;
