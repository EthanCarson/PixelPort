// This file is the main component of the PixelPort application.
// Created on 8/15/2025 by Ethan Carson with help from Google Gemini.

import { Component } from "solid-js";
import WorldContainer from "./Components/WorldContainer";
import "./style.css";
const App: Component = () => {
  return (
    <div id="App">
      <WorldContainer />
    </div>
  );
};

export default App;