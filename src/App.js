import { Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Loader, Sky, Environment, BakeShadows } from "@react-three/drei";
import { Perf } from "r3f-perf";

import Library from "./components/Library";
import Cube from "./components/Cube";
import Boundary from "./components/Boundary";
import FPSControls from "./components/FPSControls";
import { Physics } from "@react-three/cannon/dist";

export function Player() {

  return (
          <FPSControls
            camProps={{
              makeDefault: true,
              fov: 80,
              position: [0, 1.5, 0.7]
            }}
            orbitProps={{
              target: [0, 1.5, 0]
            }}
            enableJoystick
            enableKeyboard
          />
  );
}

function App() {
  // console.log(scene.camera.position)

  return (
    <>
      <Canvas shadows camera={false}>
        <ambientLight intensity={0.15} />

        <Suspense fallback={null}>
          <Physics>

          <Library />
          <BakeShadows />
          <Boundary />
          {/* <Cube /> */}

          <Player />
          </Physics>
  
          <Sky sunPosition={false} />
          {/* <Environment
            preset="sunset"
            ground={{
              radius: 28,
              scale: 1000
            }}
          /> */}
        </Suspense>
        {/* <Perf /> */}
      </Canvas>
      <Loader />
    </>
  );
}

export default App;
