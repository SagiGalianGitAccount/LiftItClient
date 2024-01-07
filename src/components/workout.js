import React, { useState } from "react";
import "../static/css/workout.css";
import InspectingWorkout from "./inspectingWorkout";

function Workout({
  date,
  reps,
  weights,
  id,
  selfRemove,
  setViewingWorkout,
  muscleId,
  exerciseId,
  updateWorkout,
}) {
  const [inspectingWorkout, setInspectingWorkout] = useState(false);

  return (
    <div className="workout-container">
      {!inspectingWorkout ? (
        <div
          onClick={() => {
            setInspectingWorkout(true);
            setViewingWorkout(true);
          }}
        >
          <p>{new Date(date).toString()}</p>
          <h2>Highest Weight - {weights[0]}</h2>
          <h2>Highest Rep - {reps[0]}</h2>
        </div>
      ) : (
        <InspectingWorkout
          selfRemove={selfRemove}
          id={id}
          setViewingWorkout={setViewingWorkout}
          setInspecting={setInspectingWorkout}
          weights={weights}
          reps={reps} //
          date={date}
          muscleId={muscleId}
          exerciseId={exerciseId}
          updateWorkout={updateWorkout}
        />
      )}
    </div>
  );
}

export default Workout;
