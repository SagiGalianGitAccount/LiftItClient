import React, { useEffect, useState } from "react";
import { backendUrl } from "./urlConnector";
import Exercise from "./exercise";
import axios from "axios";
import "../static/css/inspecting-muscle.css";
import { RiDeleteBin5Line, RiPencilLine } from "react-icons/ri";
import { IoArrowForwardOutline } from "react-icons/io5";
import { VscAdd } from "react-icons/vsc";
import Nav from "./nav";
import Loader from "./loader";
import { FcSearch } from "react-icons/fc";

function startWithStr(string, substring) {
  if (substring.length > string.length) return false;

  for (let i = 0; i < substring.length; i++) {
    if (string[i].toLowerCase() != substring[i].toLowerCase()) return false;
  }
  return true;
}

function InspectingMuslce(props) {
  const [exercises, setExercises] = useState(props.muscleExercises);
  const [newExercise, setNewExercise] = useState("");
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    setFilteredExercises(exercises);
  }, [exercises]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(backendUrl + "getExercises", {
        params: {
          accountId: localStorage.getItem("id"),
          muscleId: props.muscleId,
        },
      })
      .then((result) => {
        // console.log(result.data);
        setLoading(false);
        setExercises(result.data.muscleExercises);
      });
  }, []);

  const deleteExercise = (exerciseId) => {
    setExercises((current) =>
      current.filter((exercise) => exercise.exerciseId !== exerciseId)
    );
    axios
      .post(backendUrl + "deleteExercise", null, {
        params: {
          accountId: localStorage.getItem("id"),
          muscleId: props.muscleId,
          exerciseId: exerciseId,
        },
      })
      .then((result) => {
        console.log(result.data);
      });
  };

  const addExercise = () => {
    setNewExercise(""); // reset the field
    const exerciseId =
      exercises.length > 0 ? exercises[exercises.length - 1].exerciseId + 1 : 0;
    setExercises((current) => [
      ...current,
      {
        exerciseName: newExercise,
        data: [],
        exerciseId: exerciseId,
      },
    ]);
    axios
      .post(backendUrl + "addExerciseToMuscle", null, {
        params: {
          accountId: localStorage.getItem("id"),
          muscleId: props.muscleId,
          exerciseName: newExercise,
          exerciseId: exerciseId,
        },
      })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const renameExercise = (exerciseId, newName) => {
    const newExercises = exercises.map(item => {
      if (item.exerciseId === Number(exerciseId)){
        return {...item, exerciseName: newName}
      }
      return item
    })
    setExercises(newExercises);
  }

  return (
    <div className="inspecting-muscle-container">
      <Nav />
      {!adding && (
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 20,
            }}
          >
            <div id="scroller">
              <h1>
                {props.name} exercises ({filteredExercises.length})
              </h1>
            </div>

            <div className="buttons-inspecting-muscle">
              <FcSearch
              id="clickable"
                size={35}
                style={{
                  border: "2px solid black",
                  padding: 5,
                  borderRadius: 28,
                }}
                onClick={() => {
                  if (searching) {
                    setFilteredExercises(exercises);
                  }
                  setEditing(false)
                  setSearching((current) => !current);
                }}
              />
              <RiDeleteBin5Line
              id="clickable"
                size={35}
                color="#d8315b"
                style={{
                  border: "2px solid #d8315b",
                  padding: 5,
                  borderRadius: 28,
                }}
                onClick={() => {
                  const confirmed = window.confirm(
                    "Are you sure you want to delete this muscle? \nAll of the exercises in this muscle and it's data will be removed"
                  );
                  if (confirmed) {
                    props.removeMuscle(props.muscleId);
                    setAdding(false);
                    props.setInspecting(false);
                    props.setInspect(false);
                  }
                }}
              />

              <VscAdd
              id="clickable"
                size={35}
                color="#3f6ce1"
                style={{
                  border: "2px solid #3f6ce1",
                  padding: 5,
                  borderRadius: 28,
                }}
                onClick={() => {
                  setAdding((current) => !current);
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
                  setSearching(false)
                  setEditing(current => !current)
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
                  props.setInspect(false);
                  props.setInspecting(false); //
                }}
              />
            </div>
          </div>
          
          {editing && (
            <div style={{ display: "flex", flexDirection: 'row', justifyContent: "center" }}>
              <input
                value={newName}
                className="form-control"
                placeholder="Rename the current muscle"
                style={{ width: "95%" }}
                onChange={(e) => {
                  setNewName(e.target.value)
                }}
              />
              <button className="btn btn-primary" onClick={() => {
                props.renameMuscleLocaly(props.muscleId, newName)
                axios.post(backendUrl + 'renameMuscle', null, {params:{
                  accountId: localStorage.getItem('id'),
                  muscleId: props.muscleId,
                  newName: newName,
                }}).then(result => {
                  console.log(result.data)
                })
              }}>Change</button>
            </div>
          )}
              
          {searching && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <input
                className="form-control"
                placeholder="Search for an exercise"
                style={{ width: "95%" }}
                onChange={(e) => {
                  setFilteredExercises(
                    exercises.filter((exercise) =>
                      startWithStr(exercise.exerciseName, e.target.value)
                    )
                  );
                }}
              />
            </div>
          )}
          <div id="scroller">
            {filteredExercises.length > 0 && !loading ? (
              filteredExercises.map((exercise, index) => (
                <Exercise
                renameExercise={renameExercise}
                  muscleId={props.muscleId}
                  key={exercise.exerciseId}
                  id={exercise.exerciseId}
                  name={exercise.exerciseName}
                  deleteExercise={deleteExercise}
                  index={index}
                />
              ))
            ) : (
              <div style={{ textAlign: "center", padding: 10 }}>
                <br />
                <h2>There are 0 exercises for this muscle</h2>
              </div>
            )}
            <br />
          </div>
        </div>
      )}
      {adding && (
        <div style={{ padding: 20 }}>
          <h1>Add your exercises</h1>
          <h5>Examples for exercises are "Bench Press" "Squats" and more !</h5>
          <div
            style={{ display: "flex", justifyContent: "center", marginTop: 20 }}
          >
            <input
              value={newExercise}
              placeholder="Add Exercise"
              className="form-control"
              style={{ width: "95%" }}
              onChange={(e) => {
                setNewExercise(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addExercise();
                  setAdding(false);
                }
              }}
            />
          </div>
          <div className="inspecting-btns">
            <button
              className="btn btn-primary m-2"
              onClick={() => {
                if (newExercise !== ''){
                  addExercise();
                  setAdding(false);
                }else{
                  alert('Exercise name can not be empty')
                }
              }}
            >
              Add
            </button>
            <button
              className="btn btn-danger m-2"
              onClick={() => {
                setAdding(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {loading && <Loader />}
    </div>
  );
}

export default InspectingMuslce;
