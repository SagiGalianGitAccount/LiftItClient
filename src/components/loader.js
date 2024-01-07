import React, { Component } from "react";
import HashLoader from "react-spinners/HashLoader";
import '../static/css/loader.css';

function Loader() {
  return (
    <div className="loader">
      <HashLoader size={90} color="#3f6ce1" speedMultiplier={2} />
    </div>
  );
}

export default Loader;
