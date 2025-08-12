import { Component, onMount, createSignal } from "solid-js";
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
        const newY = currentPosition.y; // Y position is not clamped, allowing free vertical scroll

        // Clamp X (horizontal) position to keep the image within the container's horizontal bounds
        if (newX > 0) {
          newX = 0; // Prevent panning past the left edge
        } else if (newX < containerWidth - pannableWidth) {
          newX = containerWidth - pannableWidth; // Prevent panning past the right edge
        }

        // If the position was adjusted, trigger the animation to snap it back smoothly
        if (newX !== currentPosition.x) {
          setIsAnimating(true);
          setPosition({ x: newX, y: newY });
        }
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
          transform: `translate(${position().x}px, ${position().y}px) scale(${scale()})`,
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
        <img
          src="temphouse.png"
          alt="House"
          style={{
            position: "absolute",
            top: "150px",
            left: "1020px",
            "pointer-events": "none", // Prevents the image from interfering with gestures
          }}
        />
      </div>
    </div>
  );
};

export default WorldImage;
