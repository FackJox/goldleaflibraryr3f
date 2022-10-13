import { Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Loader, Sky, Environment, BakeShadows } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { Physics, RigidBody, CuboidCollider,  } from "@react-three/rapier";

import Library from "./components/Library";
import Cube from "./components/Cube";
import Boundary from "./components/Boundary";
import FPSControls from "./components/FPSControls";


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
    
function App() {
  // console.log(scene.camera.position)

  return (
    <>
      <Canvas shadows camera={false}>
        <ambientLight intensity={0.15} />

        <Suspense fallback={null}>
          <Library />
          <BakeShadows />
          <Boundary />
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
