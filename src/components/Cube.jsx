import { useFrame } from "@react-three/fiber";
import { meshBounds, Html, Select } from "@react-three/drei";
import { useRef, useState } from "react";

export default function Cube() {
  const [videoPlayerOpen, setVideoPlayerOpen] = useState(false);
  const [watchMessagePopupOpen, setWatchMessagePopupOpen] = useState(false);
  const [selectVideoOutline, setSelectVideoOutline] = useState(null);

console.log(selectVideoOutline)

  const cubeRef = useRef();

  const eventHandler = (event) => {
    setVideoPlayerOpen((current) => !current);
    console.log(event);
    cubeRef.current.material.color.set(
      `hsl(${Math.random() * 360}, 100%, 75%)`
    );
  };



  return (
    <>
 
        <mesh
          ref={cubeRef}
          position-x={2}
          position-y={1}
          scale={1.5}
          onClick={eventHandler}
          raycast={meshBounds}
          onPointerEnter=
          {() => {
            document.body.style.cursor = "pointer"; }}
          onPointerLeave=
          {() => {
            document.body.style.cursor = "default"
          }}
          >

          <Html
            position={[0, 1, 0]}
            wrapperClass="label"
            center
            distanceFactor={8}
            occlude={true}
          >
            Click to watch me!
          </Html>

          {videoPlayerOpen && (
            <Html
              position={[-2, 2, 0]}
              wrapperClass="video-container"
              centers
              distanceFactor={8}
            >
              <div id="video-player">
                <video
                  id="my-video"
                  class="video-js"
                  controls
                  preload="auto"
                  width="360"
                  height="270"
                  poster=""
                  data-setup="{}"
                >
                  <source src="galaxyShort.mp4" type="video/mp4" />
                </video>
              </div>
            </Html>
          )}

          <boxGeometry />
          <meshStandardMaterial color="mediumpurple" />
        </mesh>
    </>
  );
}
