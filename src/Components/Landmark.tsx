import { Component } from "solid-js";
interface LandmarkProps {
  src: string;
  alt: string;
  top: string;
  left: string;
}
const Landmark: Component<LandmarkProps> = (props) => {
  return (
    <img
      src={props.src}
      alt={props.alt}
      style={{
        position: "absolute",
        top: `${props.top}`,
        left: `${props.left}`,
        "pointer-events": "none", // Prevents the image from interfering with gestures
      }}
    />
  );
};
export default Landmark;
