import { Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { FPSControls } from "react-three-fpscontrols";
import { Loader, Sky, Environment, BakeShadows } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { Physics, RigidBody, CuboidCollider,  } from "@react-three/rapier";

import Library from "./components/Library";
import Cube from "./components/Cube";
import Boundary from "./components/Boundary";

export function Player() {

  return (
    <Physics gravity={[0, 0, 0]}>
      <RigidBody>
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
        <CuboidCollider mass={10} args={[1, 2, 1]} />
      </RigidBody>
    </Physics>
  );
}

function App() {
  // console.log(scene.camera.position)

  return (
    <>
      <Canvas shadows camera={false}>
        <ambientLight intensity={0.15} />

        <Suspense fallback={null}>
          <Library />
          <BakeShadows />
          {/* <Boundary /> */}
          {/* <Cube /> */}

          <Player />
  
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
