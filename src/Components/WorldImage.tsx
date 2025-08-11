import { Component, onMount, createSignal } from "solid-js";
import Hammer from "hammerjs";

const WorldImage: Component = () => {
  let containerRef: HTMLDivElement | undefined;
  let pannableRef: HTMLDivElement | undefined;

  const [position, setPosition] = createSignal({ x: 0, y: 0 });
  const [scale, setScale] = createSignal(1);
  const [isAnimating, setIsAnimating] = createSignal(false);

  onMount(() => {
    if (containerRef && pannableRef) {
      const hammer = new Hammer(containerRef);
      hammer.get("pan").set({ direction: Hammer.DIRECTION_ALL });
      hammer.get("pinch").set({ enable: true });

      let lastPosition = { x: 0, y: 0 };
      let lastScale = 1;

      hammer.on("panstart pinchstart", () => {
        lastPosition = position();
        lastScale = scale();
        setIsAnimating(false);
      });

      hammer.on("panmove", (e) => {
        setPosition({
          x: lastPosition.x + e.deltaX,
          y: lastPosition.y + e.deltaY,
        });
      });

      hammer.on("pinchin pinchout", (e) => {
        setScale(lastScale * e.scale);
      });

      hammer.on("panend", () => {
        const currentPosition = position();
        const currentScale = scale();

        const containerWidth = containerRef!.clientWidth;
        const pannableWidth = pannableRef!.scrollWidth * currentScale;

        let newX = currentPosition.x;
        const newY = currentPosition.y; // Y position is not clamped

        // Clamp X (horizontal) position
        if (newX > 0) {
          newX = 0;
        } else if (newX < containerWidth - pannableWidth) {
          newX = containerWidth - pannableWidth;
        }

        // Animate and set position only if X has changed
        if (newX !== currentPosition.x) {
          setIsAnimating(true);
          setPosition({ x: newX, y: newY });
        }
      });
    }
  });

  return (
    <div id="WorldImage" ref={containerRef}>
      <div
        ref={pannableRef}
        style={{
          position: "relative",
          "transform-origin": "0 0", // Set transform origin to top-left
          transform: `translate(${position().x}px, ${position().y}px) scale(${scale()})`,
          "touch-action": "none",
          "user-select": "none",
          transition: isAnimating() ? "transform 0.3s ease-out" : "none",
        }}
      >
        <img
          src="tempy.png"
          alt="Map"
          style={{
            "pointer-events": "none",
          }}
        />
        <img
          src="temphouse.png"
          alt="House"
          style={{
            position: "absolute",
            top: "150px",
            left: "1020px",
            "pointer-events": "none",
          }}
        />
      </div>
    </div>
  );
};

export default WorldImage;
