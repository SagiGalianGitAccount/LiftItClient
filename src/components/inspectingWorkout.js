import React, { useEffect, useState, useRef } from "react";
import Nav from "./nav";
import EditWorkout from "./editWorkout";
import { FcIdea } from "react-icons/fc";
import { RiDeleteBin5Line, RiPencilLine } from "react-icons/ri";
import { IoArrowForwardOutline } from "react-icons/io5";
import "../static/css/inspecting-workout.css";

function InspectingWorkout({
  weights,
  reps,
  setInspecting,
  setViewingWorkout,
  date,
  selfRemove,
  id,
  exerciseId,
  muscleId,
  updateWorkout,
}) {
  const [editing, setEditing] = useState(false);
  const componentRef = useRef(null);

  useEffect(() => {
    componentRef.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div
      className="inspecting-workout-container"
      ref={componentRef}
    >
      <Nav />
      <br />

      <div className="buttons-inspecting-workout">
        <FcIdea
          id="clickable"
          size={35}
          style={{
            border: "2px solid #FFCC00",
            padding: 5,
            borderRadius: 28,
          }}
          onClick={() => {
            alert(
              `Here is our suggestions for the highest weight and reps for today workout in this exercise\nWeight - ${
                Number(weights[0]) + 2.5
              }\nReps - ${Number(reps[0]) > 20 ? 8 : Number(reps[0])}`
            );
          }}
        />
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
              "Are you sure you want to delete this workout? \nThe data of this workout will be removed"
            );
            if (confirmed) {
              setInspecting(false);
              setViewingWorkout(false);
              selfRemove(id);
            }
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
            setInspecting(false);
            setViewingWorkout(false);
          }}
        />
      </div>

      <h4>{new Date(date).toString()}</h4>
      <br />
      {!editing ? (
        <div
          className="set-in-inspecting-workout"
          style={{ backgroundColor: "#fffaff" }}
        >
          {weights.map((obg, i) => (
            <div key={i}>
              <h2 style={{ fontWeight: "bold" }}>Set number {i + 1}</h2>
              <h3>
                Weight: {weights[i]}, Reps: {reps[i]}
              </h3>
              <br />
            </div>
          ))}
        </div>
      ) : (
        <EditWorkout
          setInspecting={setInspecting}
          setViewingWorkout={setViewingWorkout}
          updateWorkout={updateWorkout}
          exerciseId={exerciseId}
          muscleId={muscleId}
          id={id}
          weights={weights}
          reps={reps}
        />
      )}
      {/* <button
        className="btn btn-primary m-2"
        onClick={() => {
          setInspecting(false);
          setViewingWorkout(false);
        }}
      >
        Close
      </button> */}
      {/* <button
        className="btn btn-danger m-2"
        onClick={() => {
          const confirmed = window.confirm(
            "Are you sure you want to delete this workout? \nThe data of this workout will be removed"
          );
          if (confirmed) {
            setInspecting(false);
            setViewingWorkout(false);
            selfRemove(id);
          }
        }}
      >
        Remove
      </button> */}
      {/* <button
        className="btn btn-secondary m-2"
        onClick={() => {
          setEditing((current) => !current);
        }}
      >
        Edit
      </button> */}
    </div>
  );
}

export default InspectingWorkout;
