import React from "react";
import "../static/css/explanation.css";

function Explanation(props) {
  return (
    <div className="explanation-container">
      <div style={{backgroundColor: '#3f6ce1', padding: 30}}>
      <button
      style={{marginBottom: 10}}
        className="btn btn-danger"
        onClick={() => {
          props.setExplanation(false);
        }}
      >
        Go Back
      </button>
        <h1>
          Welcome to our website! This page will guide you through how to use
          our site effectively.
        </h1>
      </div>
      <br />
      <ol style={{margin: 30}}>
        <li>
          <h3>
            Once you log in to our website, you will arrive at the Muscles Page.
            Here, you can add the muscles you work on at the gym. For example,
            you might add Chest, Back, Legs, and more.{" "}
          </h3>
        </li>
        <br />

        <li>
          <h3>
            After you add a muscle, you can click on it to access a new page.
            Here, you can add the exercises you do for that muscle. For example,
            for your Chest muscle, you might add exercises such as Bench Press,
            Incline Bench Press, Flys, and more. Choose a name for each exercise
            that you will remember the next time you use our website.
          </h3>
        </li>
        <br />

        <li>
          <h3>
            The next step is to add workouts to your exercises. A workout is the
            actual lifting you do during an exercise. Each workout consists of a
            number of sets (which you can choose), and in each set, you select
            the number of reps and weight you lifted.
          </h3>
        </li>
      </ol>
      <br />
    <div style={{padding: 30, backgroundColor: '#e5e5e5'}}>
      <h3>
        After you complete your workout at the gym, log in to our website and
        open a new workout. Fill in the details. Your workouts will be the main
        factor that shows your progress on our charts.
      </h3>
      </div>
      
    </div>
  );
}

export default Explanation;
