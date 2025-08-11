import { Component, onMount } from "solid-js";
import Hammer from "hammerjs";

const WorldImage: Component = () => {
  let imgRef: HTMLImageElement | undefined;

  onMount(() => {
    if (imgRef) {
      // This creates a new Hammer instance and attaches it to the image element.
      const hammer = new Hammer(imgRef);
    }
  });

  return (
    <div id="WorldImage">
      <img ref={imgRef} src="tempy.png" alt="Map" />
    </div>
  );
};

export default WorldImage;
