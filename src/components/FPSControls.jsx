import * as THREE from "three";
import { useBox } from "@react-three/cannon";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useCallback, useEffect, useRef } from "react";
import nipplejs from "nipplejs";

let fwdValue = 0;
let bkdValue = 0;
let rgtValue = 0;
let lftValue = 0;
let joyManager;
const SPEED = 5
const fwdVector = new THREE.Vector3();
const bkwVector = new THREE.Vector3();
const lftVector = new THREE.Vector3();
const rgtVector = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();
const upVector = new THREE.Vector3(0, 1, 0);
const direction = new THREE.Vector3();
const speed = new THREE.Vector3()

const NIPPLEJS_OPTIONS = {
  zone: document.getElementById("joystickWrapper1"),
  size: 120,
  multitouch: true,
  maxNumberOfNipples: 1,
  mode: "static",
  restJoystick: true,
  shape: "circle",
  position: { top: "60px", left: "60px" },
  dynamicPage: false
};

const handleMove = (evt, data) => {
  const forward = data.vector.y;
  const turn = data.vector.x;

  if (forward > 0) {
    fwdValue = Math.abs(forward);
    bkdValue = 0;
  } else if (forward < 0) {
    fwdValue = 0;
    bkdValue = Math.abs(forward);
  }

  if (turn > 0) {
    lftValue = 0;
    rgtValue = Math.abs(turn);
  } else if (turn < 0) {
    lftValue = Math.abs(turn);
    rgtValue = 0;
  }
};

function useKeyboard({ enableKeyboard }) {
  const onKeyDown = (event) => {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        handleMove({}, { vector: { y: 1 } });
        break;

      case "ArrowLeft":
      case "KeyA":
        handleMove({}, { vector: { x: -1 } });
        break;

      case "ArrowDown":
      case "KeyS":
        handleMove({}, { vector: { y: -1 } });
        break;

      case "ArrowRight":
      case "KeyD":
        handleMove({}, { vector: { x: 1 } });
        break;
      default:
        break;
    }
  };

  const onKeyUp = (event) => {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        fwdValue = 0;
        break;

      case "ArrowLeft":
      case "KeyA":
        lftValue = 0;
        break;

      case "ArrowDown":
      case "KeyS":
        bkdValue = 0;
        break;

      case "ArrowRight":
      case "KeyD":
        rgtValue = 0;
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (enableKeyboard) {
      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("keyup", onKeyUp);
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [enableKeyboard]);
}

function useJoystick({ enableJoystick }) {
  const handleEnd = () => {
    bkdValue = 0;
    fwdValue = 0;
    lftValue = 0;
    rgtValue = 0;
  };

  useEffect(() => {
    if (!joyManager && enableJoystick) {
      joyManager = nipplejs.create(NIPPLEJS_OPTIONS);
      joyManager["0"].on("move", handleMove);
      joyManager["0"].on("end", handleEnd);
    }

    return () => {
      if (joyManager) {
        joyManager["0"].off("move", handleMove);
        joyManager["0"].off("end", handleEnd);
      }
    };
  }, [enableJoystick]);
}

const FPSControls = ({
  enableJoystick,
  enableKeyboard,
  orbitProps = {},
  camProps = {},
  mult = 0.1,
  props
}) => {
  const orbitRef = useRef();
  const camRef = useRef();
  const [meshRef, api] = useBox(() => ({
    mass: 1,
    type: "Dynamic",
    position: [0, 2, 0]
  , ...props}));

  const velocity = useRef([0, 0, 0]);
  
  useEffect(
    () => api.velocity.subscribe((v) => (velocity.current = v)),
    []
  );

  const updatePlayer = useCallback(() => {
    const mesh = meshRef.current;
    const controls = orbitRef.current;
    const camera = camRef.current;

    // move the player
    const angle = controls.getAzimuthalAngle();

    if (fwdValue > 0) {
      fwdVector.set(0, 0, -fwdValue).applyAxisAngle(upVector, angle);
      mesh.position.addScaledVector(fwdVector, mult);
    }

    if (bkdValue > 0) {
      bkwVector.set(0, 0, bkdValue).applyAxisAngle(upVector, angle);
      mesh.position.addScaledVector(bkwVector, mult);
    }

    //     frontVector.set(0, 0, Number(backward) - Number(forward))
    frontVector.set(0, 0, Number(bkdValue) - Number(fwdValue));

    // console.log("fwdVector", fwdVector)
    // console.log("bkwVector", bkwVector)
    // console.log("frontVector", frontVector)

    if (lftValue > 0) {
      lftVector.set(-lftValue, 0, 0).applyAxisAngle(upVector, angle);
      mesh.position.addScaledVector(lftVector, mult);
    }

    if (rgtValue > 0) {
      rgtVector.set(rgtValue, 0, 0).applyAxisAngle(upVector, angle);
      mesh.position.addScaledVector(rgtVector, mult);
    }

    // sideVector.set(Number(left) - Number(right), 0, 0)
    sideVector.set(Number(lftValue) - Number(rgtValue), 0, 0);

    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED)
    speed.fromArray(velocity.current)

    
    api.velocity.set(direction.x, velocity.current[1], direction.z);

    // console.log(velocity)
    // console.log(direction.x)
    // console.log(direction.z)

    // mesh.updateMatrixWorld();

    // reposition camera
    camera.position.sub(controls.target);
    controls.target.copy(mesh.position);
    camera.position.add(mesh.position);
  }, [meshRef, orbitRef, camRef, api, mult]);

  useFrame(() => {
    updatePlayer();


  });

  useJoystick({ enableJoystick });
  useKeyboard({ enableKeyboard });

  

  return (
    <>
      <PerspectiveCamera {...camProps} ref={camRef} />
      <OrbitControls
        autoRotate={false}
        enableDamping={true}
        enableZoom={false}
        enablePan={false}
        autoRotateSpeed={0}
        rotateSpeed={0.4}
        dampingFactor={0.4}
        {...orbitProps}
        ref={orbitRef}
      />

      <mesh
        position={orbitProps.target || [0, 0, 0]}
        visible={false}
        ref={meshRef}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </>
  );
};

export default FPSControls;
