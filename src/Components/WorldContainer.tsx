// This component contains the world map and all the landmarks.
// Created on 8/15/2025 by Ethan Carson with help from Google Gemini.

import { Component } from "solid-js";
import WorldImage from "./WorldImage";
const WorldContainer: Component = () => {
  return (
    <div id="WorldContainer">
      <WorldImage />
    </div>
  );
};
export default WorldContainer;