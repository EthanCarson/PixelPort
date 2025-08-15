// This component displays the world map image.
// Created on 8/15/2025 by Ethan Carson with help from Google Gemini.

import { Component, onMount, createSignal } from "solid-js";
import Landmark from "./Landmark";
import Hammer from "hammerjs";

const WorldImage: Component = () => {
  // Refs for the main container and the pannable/zoomable div
  let containerRef: HTMLDivElement | undefined;
  let pannableRef: HTMLDivElement | undefined;

  // --- STATE MANAGEMENT ---
  // Holds the current x/y position of the pannable container
  const [position, setPosition] = createSignal({ x: 0, y: 0 });
  // Holds the current scale of the pannable container
  const [scale, setScale] = createSignal(1);
  // Used to apply a smooth transition effect when snapping to boundaries
  const [isAnimating, setIsAnimating] = createSignal(false);

  // --- COMPONENT INITIALIZATION ---
  onMount(() => {
    if (containerRef && pannableRef) {
      // Initialize HammerJS on the main container to listen for gestures
      const hammer = new Hammer(containerRef);
      // Enable panning in all directions and pinch-to-zoom
      hammer.get("pan").set({ direction: Hammer.DIRECTION_ALL });
      hammer.get("pinch").set({ enable: true });

      // --- GESTURE STATE ---
      // Store the last position and scale to calculate movement delta
      let lastPosition = { x: 0, y: 0 };
      let lastScale = 1;

      // --- EVENT HANDLERS ---
      // When a pan or pinch starts, capture the current state
      hammer.on("panstart pinchstart", () => {
        lastPosition = position();
        lastScale = scale();
        setIsAnimating(false); // Stop any ongoing boundary animation
      });

      // On pan, update the position based on the drag delta
      hammer.on("panmove", (e) => {
        setPosition({
          x: lastPosition.x + e.deltaX,
          y: lastPosition.y + e.deltaY,
        });
      });

      // On pinch, update the scale
      hammer.on("pinchin pinchout", (e) => {
        setScale(lastScale * e.scale);
      });

      // When panning ends, check and enforce boundaries
      hammer.on("panend", () => {
        const currentPosition = position();
        const currentScale = scale();

        const containerWidth = containerRef!.clientWidth;
        const pannableWidth = pannableRef!.scrollWidth * currentScale;

        let newX = currentPosition.x;
        let newY = currentPosition.y; // Y position is not clamped, allowing free vertical scroll

        // Clamp X (horizontal) position to keep the image within the container's horizontal bounds
        if (newX > 0) {
          newX = 0; // Prevent panning past the left edge
        } else if (newX < containerWidth - pannableWidth) {
          newX = containerWidth - pannableWidth; // Prevent panning past the right edge
        }
        if (newY > 0) {
          newY = 0; // Prevent panning past the left edge
        }
        // If the position was adjusted, trigger the animation to snap it back smoothly
        if (newX !== currentPosition.x || newY !== currentPosition.y) {
          setIsAnimating(true);
          setPosition({ x: newX, y: newY });
        }
      });

      // --- MOUSE WHEEL SCROLL ---
      containerRef.addEventListener("wheel", (e) => {
        e.preventDefault(); // Prevent default page scroll

        const currentPosition = position();
        const currentScale = scale();

        // Calculate new Y position
        let newY = currentPosition.y - e.deltaY; // Adjust Y based on wheel delta

        // Get dimensions for clamping
        const containerHeight = containerRef!.clientHeight;
        const pannableHeight = pannableRef!.scrollHeight * currentScale;

        // Clamp Y (vertical) position to keep the image within the container's vertical bounds
        // Prevent scrolling past the top edge
        if (newY > 0) {
          newY = 0;
        }

        // Prevent scrolling past the bottom edge, but only if the content is taller than the container
        if (pannableHeight > containerHeight) {
          if (newY < containerHeight - pannableHeight) {
            newY = containerHeight - pannableHeight;
          }
        } else {
          // If content is not taller than container, don't allow vertical scrolling
          newY = 0;
        }

        // Update the position
        setPosition({ x: currentPosition.x, y: newY });
      });
    }
  });

  // --- JSX ---
  return (
    // The main container that fills the viewport and listens for gestures
    <div id="WorldImage" ref={containerRef}>
      {/* The inner container that is moved and scaled */}
      <div
        ref={pannableRef}
        style={{
          position: "relative", // Establishes a positioning context for child images
          "transform-origin": "0 0", // Sets the zoom origin to the top-left corner for correct boundary calculations
          transform: `translate(${position().x}px, ${
            position().y
          }px) scale(${scale()})`,
          "touch-action": "none", // Disables default touch actions like scrolling
          "user-select": "none", // Prevents text selection while dragging
          transition: isAnimating() ? "transform 0.3s ease-out" : "none", // Smooth animation for boundary snapping
        }}
      >
        {/* Base landscape image. It's in the normal document flow to give the parent its size. */}
        <img
          src="tempy.png"
          alt="Map"
          style={{
            "pointer-events": "none", // Prevents the image from interfering with gestures
          }}
        />
        {/* Overlay image, positioned absolutely relative to the landscape */}
        <Landmark src="temphouse.png" alt="house" top="1020px" left="500px" />
      </div>
    </div>
  );
};

export default WorldImage;