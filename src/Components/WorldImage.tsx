import { Component, onMount, createSignal } from "solid-js";
import Hammer from "hammerjs";

const WorldImage: Component = () => {
  let containerRef: HTMLDivElement | undefined;
  let imgRef: HTMLImageElement | undefined;

  const [position, setPosition] = createSignal({ x: 0, y: 0 });
  const [scale, setScale] = createSignal(1);
  const [isAnimating, setIsAnimating] = createSignal(false);

  onMount(() => {
    if (imgRef && containerRef) {
      const hammer = new Hammer(imgRef);
      hammer.get("pan").set({ direction: Hammer.DIRECTION_ALL });
      hammer.get("pinch").set({ enable: true });

      let lastPosition = { x: 0, y: 0 };
      let lastScale = 1;

      hammer.on("panstart pinchstart", () => {
        lastPosition = position();
        lastScale = scale();
        setIsAnimating(false); // Stop animation when user interacts
      });

      hammer.on("panmove", (e) => {
        setPosition({
          x: lastPosition.x + e.deltaX,
          y: lastPosition.y + e.deltaY,
        });
      });

      hammer.on("pinchin pinchout", (e) => { //Change scale on pinch
        setScale(lastScale * e.scale);
      });

      hammer.on("panend", () => {
        const currentPosition = position();
        const currentScale = scale();
        const containerWidth = containerRef!.clientWidth;
        const imgWidth = imgRef!.clientWidth * currentScale;

        let newX = currentPosition.x;
        let newY = currentPosition.y;

        // Check left boundary
        if (newX > 0) {
          newX = 0;
        }
        // Check right boundary
        else if (newX < containerWidth - imgWidth) {
          newX = containerWidth - imgWidth;
        }

        // Check top boundary
        if (newY > 0) {
          newY = 0;
        }
        // No check for bottom boundary, as requested.

        if (newX !== currentPosition.x || newY !== currentPosition.y) {
          setIsAnimating(true);
          setPosition({ x: newX, y: newY });
        }
      });
    }
  });

  return (
    <div id="WorldImage" ref={containerRef}>
      <img
        ref={imgRef}
        src="tempy.png"
        alt="Map"
        style={{
          transform: `translate(${position().x}px, ${position().y}px) scale(${scale()})`,
          "touch-action": "none",
          "user-select": "none",
          transition: isAnimating() ? "transform 0.3s ease-out" : "none",
        }}
      />
    </div>
  );
};

export default WorldImage;
